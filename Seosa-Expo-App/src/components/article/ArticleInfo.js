/* src/components/article/ArticleInfo.js */
import React, { useState } from 'react';
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
import ClockIcon from '../../icons/clock.svg';
import PhoneIcon from '../../icons/phone.svg';
import InstaIcon from '../../icons/insta.svg';

// Kakao JavaScript 키 (WebView용)
const KAKAO_JS_KEY = 'REDACTED_KAKAO_JS_KEY';
const { width, height } = Dimensions.get('window');
const ICON_SIZE = height * 0.02;

export default function ArticleInfo({ info, onChange, onMapPress }) {
  const { address, coords, openDays, phoneNumber, instagramLink } = info;

  const htmlContent = coords
    ? `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}"></script>
<style>body, html {margin:0;padding:0;height:100%;}#map{width:100%;height:100%;}</style>
</head>
<body>
<div id="map"></div>
<script>
kakao.maps.load(function() {
  var map = new kakao.maps.Map(document.getElementById('map'), {
    center: new kakao.maps.LatLng(${coords.lat}, ${coords.lng}),
    level: 4
  });
  new kakao.maps.Marker({ position: map.getCenter(), map: map });
});
</script>
</body>
</html>`
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>서점 정보</Text>
      </View>
      <TouchableOpacity style={styles.map} onPress={onMapPress}>
        {htmlContent ? (
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={styles.mapImage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        ) : (
          <Text style={styles.mapPlaceholder}>지도에서 위치 선택</Text>
        )}
      </TouchableOpacity>
      <View style={styles.infoes}>
        <View style={styles.row}>
          <LocationIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="위치 입력"
            value={address}
            onChangeText={text => onChange({ ...info, address: text })}
          />
        </View>
        <View style={styles.row}>
          <ClockIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="영업일 / 시간 입력"
            value={openDays}
            onChangeText={text => onChange({ ...info, openDays: text })}
          />
        </View>
        <View style={styles.row}>
          <PhoneIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="전화번호 입력"
            value={phoneNumber}
            onChangeText={text => onChange({ ...info, phoneNumber: text })}
          />
        </View>
        <View style={styles.row}>
          <InstaIcon width={ICON_SIZE} height={ICON_SIZE} />
          <TextInput
            style={styles.input}
            placeholder="링크 입력"
            value={instagramLink}
            onChangeText={text => onChange({ ...info, instagramLink: text })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, backgroundColor: '#FFFEFB', alignItems: 'center' },
  title: { width: width * 0.9, height: height * 0.06, marginTop: height * 0.0125, marginBottom: height * 0.015, justifyContent: 'center' },
  titleText: { fontSize: height * 0.023, color: '#666666', fontWeight: '500', fontFamily: 'Noto Sans' },
  map: { width: width * 0.9, height: height * 0.2175, backgroundColor: '#B2B2B2', marginBottom: height * 0.015 },
  mapImage: { flex: 1, width: '100%', height: '100%' },
  mapPlaceholder: { fontSize: 14, color: '#999', textAlign: 'center' },
  infoes: { marginBottom: height * 0.05 },
  row: { width: width * 0.9, flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.015 },
  input: { flex: 1, height: height * 0.02, fontSize: 14, color: '#666666', marginLeft: 6, paddingVertical: 0, textAlignVertical: 'center' },
});
