import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator, Alert } from "react-native";
import LocationIcon from "../../icons/location.svg";
import ClockIcon from "../../icons/clock.svg";
import PhoneIcon from "../../icons/phone.svg";
import InstaIcon from "../../icons/insta.svg";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = height * 0.02;

// Kakao REST API Key (env에 EXPO_PUBLIC_KAKAO_REST_KEY로 넣어두신 값)
const kakaoKey =
  Constants.expoConfig?.extra?.kakaoRestKey ??
  process.env.EXPO_PUBLIC_KAKAO_REST_KEY;

export default function PostInfo({ info }) {
  const [coords, setCoords] = useState(null);  // { lat, lng }
  const [loadingMap, setLoadingMap] = useState(false);

  const {
    postalCode,
    address,
    detailedAddress,
    openDays,
    openHours,
    phoneNumber,
    instagramLink,
  } = info;

  /* 1) mount 시 postalCode → 좌표 변환 */
  useEffect(() => {
    const fetchCoordsByPostal = async () => {
      if (!postalCode) return;  // postalCode 없으면 아무것도 안 함
      if (!kakaoKey) {
        Alert.alert("API Key 오류", "kakaoRestKey가 설정되지 않았습니다");
        return;
      }

      setLoadingMap(true);
      try {
        // Kakao 주소 검색 API (주소 검색) → postalCode를 query로 사용
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(postalCode)}`,
          { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
        );
        const json = await res.json();

        if (Array.isArray(json.documents) && json.documents.length > 0) {
          // 첫 번째 결과 사용
          const doc = json.documents[0];
          // 문서의 x(경도), y(위도)
          const lat = parseFloat(doc.y);
          const lng = parseFloat(doc.x);
          setCoords({ lat, lng });
        } else {
          // 결과가 없으면 폴백
          Alert.alert("지도 불러오기 실패", "해당 우편번호로 지도를 찾을 수 없습니다.");
        }
      } catch (e) {
        console.error(e);
        Alert.alert("지도 불러오기 오류", e.message);
      } finally {
        setLoadingMap(false);
      }
    };

    fetchCoordsByPostal();
  }, [postalCode]);

  /* 2) Static Map URL 생성 */
  const getStaticMapUrl = () => {
    if (!coords) return null;
    const zoom  = 3; // 지도의 확대/축소 레벨 (0~14, 숫자 낮을수록 더 멀리)
    const pxW   = Math.floor(width * 0.9);          // 이미지 가로(px)
    const pxH   = Math.floor(height * 0.2175);      // 이미지 세로(px)
    const { lat, lng } = coords;
    return `https://dapi.kakao.com/v2/maps/sdk/staticmap?appkey=${kakaoKey}` +
           `&center=${lng},${lat}` +
           `&level=${zoom}` +
           `&w=${pxW}` +
           `&h=${pxH}` +
           `&markers=${lng},${lat}`; 
  };

  const staticMapUrl = getStaticMapUrl();

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title_text}>서점 정보</Text>
      </View>

      {/* 3) Static Map 이미지 */}
      <View style={styles.mapWrapper}>
        {loadingMap ? (
          <ActivityIndicator size="large" color="#487153" />
        ) : staticMapUrl ? (
          <Image
            source={{ uri: staticMapUrl }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: "#999" }}>지도 정보 없음</Text>
          </View>
        )}
      </View>

      {/* 4) 나머지 서점 정보 */}
      <View style={styles.infoSection}>
        {/* 주소 */}
        <View style={styles.row}>
          <LocationIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>
            {address} {detailedAddress}
          </Text>
        </View>

        {/* 영업일/영업시간 */}
        <View style={styles.row}>
          <ClockIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>
            {openDays} / {openHours}
          </Text>
        </View>

        {/* 전화번호 */}
        <View style={styles.row}>
          <PhoneIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{phoneNumber}</Text>
        </View>

        {/* 인스타 링크 */}
        <View style={styles.row}>
          <InstaIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.link}>인스타그램: {instagramLink}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
  },
  title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.01,
    justifyContent: "center",
  },
  title_text: {
    fontSize: height * 0.023,
    color: "#666666",
    fontWeight: "500",
    fontFamily: "Noto Sans",
  },
  mapWrapper: {
    width: width * 0.9,
    height: height * 0.2175,
    backgroundColor: "#B2B2B2",
    marginBottom: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  mapPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  infoSection: {
    width: width * 0.9,
    marginTop: height * 0.01,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  text: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 6,
  },
  link: {
    fontSize: 14,
    color: "#3f729b",
    marginLeft: 6,
  },
});
