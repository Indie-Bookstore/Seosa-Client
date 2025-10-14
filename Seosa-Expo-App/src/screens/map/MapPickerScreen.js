import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

/* ───────── Kakao REST 키 ───────── */
const kakaoKey =
  Constants.expoConfig?.extra?.kakaoRestKey ??
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY;

export default function MapPickerScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 1) 위치 권한 & 현재 위치 */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords); // { latitude, longitude, ... }
    })();
  }, []);

  /* 2) Kakao 키워드 검색 (현 위치 기준 가중치: x=lng, y=lat, radius 옵션) */
  const onSearch = async () => {
    if (!searchQuery.trim()) return Alert.alert('검색어를 입력해주세요');
    if (!kakaoKey) return Alert.alert('API Key 오류', 'kakaoRestKey가 설정되지 않았습니다');

    setLoading(true);
    try {
      // 위치를 알고 있으면 근방 검색 가중치 부여
      const x = location?.longitude;
      const y = location?.latitude;
      const radius = 20000; // 20km (필요 시 조정)

      const queryParams = new URLSearchParams({
        query: searchQuery,
        ...(x && y ? { x: String(x), y: String(y), radius: String(radius) } : {}),
        size: '15',
        page: '1',
      });

      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?${queryParams.toString()}`,
        { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
      );
      const json = await res.json();

      if (Array.isArray(json.documents) && json.documents.length > 0) {
        setResults(json.documents);
      } else {
        Alert.alert('검색 결과가 없습니다');
        setResults([]);
      }
    } catch (e) {
      Alert.alert('검색 중 오류', e.message);
    } finally {
      setLoading(false);
    }
  };

  /* 3) 장소 선택 → postalCode/lat/lng/kakaoPlaceId 포함 emit
       - Kakao Keyword 응답: item.id(카카오 장소 ID), item.x(lng), item.y(lat), item.address_name
       - 우편번호: address API에서 road_address.zone_no 우선 사용
  */
  const selectPlace = async (p) => {
    // Kakao Keyword 문서에서:
    // - p.id: 카카오 장소 id
    // - p.x: 경도(lng, 문자열), p.y: 위도(lat, 문자열)
    // - p.address_name: 지번/도로명이 혼합될 수 있음
    // - p.road_address_name: 도로명 주소(없을 수 있음)
    let zoneNo = p.road_address?.zone_no ?? ''; // 일부 응답엔 road_address 객체가 없음
    const lat = parseFloat(p.y);
    const lng = parseFloat(p.x);
    const kakaoPlaceId = String(p.id);

    /* road_address.zone_no 가 없으면 주소 검색 API로 확보 */
    if (!zoneNo) {
      try {
        const addressQuery = p.road_address_name || p.address_name || '';
        if (addressQuery) {
          const resAddr = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
              addressQuery
            )}`,
            { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
          );
          const jsonAddr = await resAddr.json();

          if (Array.isArray(jsonAddr.documents) && jsonAddr.documents.length > 0) {
            const firstDoc = jsonAddr.documents[0];
            if (firstDoc.road_address?.zone_no) {
              zoneNo = firstDoc.road_address.zone_no;
            }
          }
        }
      } catch (e) {
        console.error('주소 검색 중 오류:', e);
        // zone_no 못 얻어도 진행
      }
    }

    // 주소는 address_name(기본 주소)을 기본값으로 사용
    const address = p.address_name || p.road_address_name || '';

    /* ★ 모든 필드 포함하여 emit */
    DeviceEventEmitter.emit('mapSelect', {
      address,
      coords: { lat, lng },
      lat,
      lng,
      postalCode: zoneNo,
      kakaoPlaceId,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        {/* 검색창 */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="검색어 입력"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <TouchableOpacity style={styles.button} onPress={onSearch}>
            {loading ? <ActivityIndicator /> : <Text>검색</Text>}
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => selectPlace(item)}>
              <Text style={styles.title}>{item.place_name}</Text>
              <Text style={styles.address}>{item.address_name}</Text>
              {!!item.road_address_name && (
                <Text style={styles.roadAddr}>{item.road_address_name}</Text>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && (
              <View style={styles.empty}>
                <Text>검색어를 입력하고 검색 버튼을 눌러주세요</Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* ───────── 스타일 ───────── */
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  box: { flex: 1, width: width * 0.9 },
  searchBox: { flexDirection: 'row', marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
  button: {
    marginLeft: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e2e7e3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 16, color: '#000' },
  address: { fontSize: 12, color: '#666', marginTop: 4 },
  roadAddr: { fontSize: 12, color: '#666', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 20 },
});
