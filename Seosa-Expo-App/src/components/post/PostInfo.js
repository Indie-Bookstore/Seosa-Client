import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';

import LocationIcon from '../../icons/location.svg';
import ClockIcon    from '../../icons/clock.svg';
import PhoneIcon    from '../../icons/phone.svg';
import InstaIcon    from '../../icons/insta.svg';

const KAKAO_JS_KEY = '4c6a9d6cb2a66951381dc4ea3a6b3ea5'; // 환경변수로 빼도 무방
const { width, height } = Dimensions.get('window');
const ICON = height * 0.02;

export default function ArticleInfo({
  info,
  detailedAddress,
  openHours,
  onChangeInfo,
  onChangeDetail,
  onChangeHours,
  onMapPress,
}) {
  /* ★ postalCode 구조분해 추가 */
  const {
    address,
    coords,
    openDays,
    phoneNumber,
    instagramLink,
    postalCode,        // ← 추가
  } = info;

  /* 지도 미리보기용 HTML */
  const htmlContent = coords
    ? `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}"></script>
<style>html,body{margin:0;height:100%}#map{width:100%;height:100%}</style>
</head><body><div id="map"></div>
<script>
kakao.maps.load(function(){
  var c = new kakao.maps.LatLng(${coords.lat},${coords.lng});
  var map = new kakao.maps.Map(document.getElementById('map'),{center:c,level:4});
  new kakao.maps.Marker({ position:c, map:map });
});
</script></body></html>`
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>서점 정보</Text>

      {/* 지도 미리보기 */}
      <TouchableOpacity style={styles.map} onPress={onMapPress}>
        {htmlContent ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.mapImage}
            javaScriptEnabled
            domStorageEnabled
          />
        ) : (
          <Text style={styles.mapPlaceholder}>지도에서 위치 선택</Text>
        )}
      </TouchableOpacity>

      <View style={styles.infoes}>
        {/* 기본 주소 */}
        <View style={styles.row}>
          <LocationIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="주소"
            value={address}
            onChangeText={(text) => onChangeInfo({ ...info, address: text })}
          />
        </View>

        {/* ★ 우편번호 */}
        <View style={styles.row}>
          <LocationIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="우편번호"
            keyboardType="numeric"
            value={postalCode}
            onChangeText={(text) => onChangeInfo({ ...info, postalCode: text })}
          />
        </View>

        {/* 상세 주소 */}
        <View style={styles.row}>
          <LocationIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="상세 주소"
            value={detailedAddress}
            onChangeText={onChangeDetail}
          />
        </View>

        {/* 영업일 */}
        <View style={styles.row}>
          <ClockIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="영업일"
            value={openDays}
            onChangeText={(text) => onChangeInfo({ ...info, openDays: text })}
          />
        </View>

        {/* 영업시간 */}
        <View style={styles.row}>
          <ClockIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="영업시간"
            value={openHours}
            onChangeText={onChangeHours}
          />
        </View>

        {/* 전화번호 */}
        <View style={styles.row}>
          <PhoneIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="전화번호"
            value={phoneNumber}
            onChangeText={(text) => onChangeInfo({ ...info, phoneNumber: text })}
          />
        </View>

        {/* 인스타 링크 */}
        <View style={styles.row}>
          <InstaIcon width={ICON} height={ICON} />
          <TextInput
            style={styles.input}
            placeholder="Instagram 링크"
            value={instagramLink}
            onChangeText={(text) => onChangeInfo({ ...info, instagramLink: text })}
          />
        </View>
      </View>
    </View>
  );
}

/* ───────── 스타일 ───────── */
const styles = StyleSheet.create({
  container: { width, backgroundColor: '#FFFEFB', alignItems: 'center' },
  titleText: {
    width: width * 0.9,
    fontSize: height * 0.023,
    color: '#666',
    fontWeight: '500',
    marginVertical: height * 0.015,
  },
  map: {
    width: width * 0.9,
    height: height * 0.22,
    backgroundColor: '#B2B2B2',
    marginBottom: height * 0.015,
  },
  mapImage: { flex: 1, width: '100%', height: '100%' },
  mapPlaceholder: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  infoes: { width: width * 0.9, marginBottom: height * 0.05 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  input: {
    flex: 1,
    height: height * 0.035,
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    paddingVertical: 0,
  },
});
