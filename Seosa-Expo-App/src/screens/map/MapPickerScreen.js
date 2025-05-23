// src/screens/MapPickerScreen.js
import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as Location from "expo-location";

const KAKAO_REST_API_KEY = "REDACTED_KAKAO_JS_KEY";

export default function MapPickerScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 위치 권한 & 현재 위치
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("권한 필요", "위치 권한이 필요합니다");
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // 검색
  const onSearch = async () => {
    if (!searchQuery.trim()) return Alert.alert("검색어를 입력해주세요");
    if (!location) return Alert.alert("위치 정보를 가져오는 중입니다");

    setLoading(true);
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
          searchQuery
        )}`,
        { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } }
      );
      const json = await res.json();
      if (json.documents.length) setResults(json.documents);
      else {
        Alert.alert("검색 결과가 없습니다");
        setResults([]);
      }
    } catch (e) {
      Alert.alert("검색 중 오류 발생", e.message);
    } finally {
      setLoading(false);
    }
  };

  // 선택 시 DeviceEventEmitter로 emit
  const selectPlace = (place) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    DeviceEventEmitter.emit("mapSelect", {
      address: place.address_name,
      coords: { lat, lng },
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
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
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => selectPlace(item)}>
            <Text style={styles.title}>{item.place_name}</Text>
            <Text style={styles.address}>
              {item.address_name}
            </Text>
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
  container: { flex: 1, backgroundColor: "#fff", alignItems:'center' },
  box : {
    flex:1,
    width:width*0.9, 
    alignContent:'center'
  },
  searchBox: { flexDirection: "row", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
  },
  button: {
    marginLeft: 8,
    paddingHorizontal: 12,
    backgroundColor: "#e2e7e3",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 16, color: "#000" },
  address: { fontSize: 12, color: "#666", marginTop: 4 },
  empty: { alignItems: "center", marginTop: 20 },
});
