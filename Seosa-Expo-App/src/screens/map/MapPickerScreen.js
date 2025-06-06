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

const kakaoKey =
  Constants.expoConfig?.extra?.kakaoRestKey ??
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY;

export default function MapPickerScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 1) 위치 권한 & 현재 위치 가져오기 */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  /* 2) Kakao 키워드 검색 (장소 검색) */
  const onSearch = async () => {
    if (!searchQuery.trim()) return Alert.alert('검색어를 입력해주세요');
    if (!location) return Alert.alert('위치 정보를 가져오는 중입니다');
    if (!kakaoKey) return Alert.alert('API Key 오류', 'kakaoRestKey가 설정되지 않았습니다');

    setLoading(true);
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchQuery)}`,
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

  /* 3) 장소 선택 → 좌표(lat, lng) + 우편번호(zone_no) 얻어서 emit */
  const selectPlace = async (p) => {
    // 1) 우선 p.road_address?.zone_no가 있는지 확인
    let zoneNo = p.road_address?.zone_no ?? '';

    // 2) p.road_address.zone_no가 없으면, 주소 검색 API로 다시 zone_no 얻기
    if (!zoneNo) {
      try {
        const addressQuery = p.address_name; // 예: "서울시 마포구 서교동"
        const resAddr = await fetch(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(addressQuery)}`,
          { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
        );
        const jsonAddr = await resAddr.json();

        if (Array.isArray(jsonAddr.documents) && jsonAddr.documents.length > 0) {
          const firstDoc = jsonAddr.documents[0];
          if (firstDoc.road_address?.zone_no) {
            zoneNo = firstDoc.road_address.zone_no;
          }
        }
      } catch (e) {
        console.error("주소 검색 중 오류:", e);
        // 우편번호를 못 얻어도 계속 진행
      }
    }

    // 3) DeviceEventEmitter로 mapSelect 이벤트 emit
    DeviceEventEmitter.emit('mapSelect', {
      address: p.address_name,
      coords: { lat: parseFloat(p.y), lng: parseFloat(p.x) },
      postalCode: zoneNo,
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

        {/* 검색 결과 리스트 */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => selectPlace(item)}
            >
              <Text style={styles.title}>{item.place_name}</Text>
              <Text style={styles.address}>{item.address_name}</Text>
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

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', alignItems:'center' },
  box: { flex:1, width: width * 0.9 },
  searchBox: { flexDirection:'row', marginBottom:12 },
  input: {
    flex:1, borderWidth:1, borderColor:'#ccc', borderRadius:4,
    paddingHorizontal:8, height:40,
  },
  button: {
    marginLeft:8, paddingHorizontal:12, backgroundColor:'#e2e7e3',
    justifyContent:'center', alignItems:'center',
  },
  item: {
    paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#eee',
  },
  title: { fontSize:16, color:'#000' },
  address: { fontSize:12, color:'#666', marginTop:4 },
  empty: { alignItems:'center', marginTop:20 },
});
