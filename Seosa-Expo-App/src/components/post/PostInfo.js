import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import LocationIcon from '../../icons/location.svg';
import ClockIcon from '../../icons/clock.svg';
import PhoneIcon from '../../icons/phone.svg';
import InstaIcon from '../../icons/insta.svg';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = height * 0.02;

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY;

export default function PostInfo({ info }) {
  const {
    address,
    detailedAddress,
    lat,
    lng,
    openDays,
    openHours,
    phoneNumber,
    instagramLink,
  } = info ?? {};

  // 숫자 강제 + coords 통일
  const coords = useMemo(() => {
    const nlat = Number(lat);
    const nlng = Number(lng);
    if (Number.isFinite(nlat) && Number.isFinite(nlng)) return { lat: nlat, lng: nlng };
    return null;
  }, [lat, lng]);

  const htmlContent = useMemo(() => {
    // 좌표나 JS 키가 없으면 렌더하지 않음
    if (!coords || !KAKAO_JS_KEY) return null;

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  html, body { margin:0; padding:0; height:100%; }
  #map { position:absolute; top:0; left:0; right:0; bottom:0; }
  body { position:relative; }
</style>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}"></script>
</head>
<body>
<div id="map"></div>
<script>
  kakao.maps.load(function() {
    var center = new kakao.maps.LatLng(${coords.lat}, ${coords.lng});
    var mapContainer = document.getElementById('map');
    var map = new kakao.maps.Map(mapContainer, {
      center: center,
      level: 4
    });
    map.setDraggable(false);
    map.setZoomable(false);
    var marker = new kakao.maps.Marker({ position: center });
    marker.setMap(map);

    function recenter() {
      map.relayout();
      map.setCenter(center);
    }

    recenter();
    setTimeout(recenter, 50);
    setTimeout(recenter, 150);
    window.addEventListener('resize', recenter);
  });
</script>
</body>
</html>`;
  }, [coords?.lat, coords?.lng]);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title_text}>서점 정보</Text>
      </View>

      <View style={styles.mapWrapper}>
        {htmlContent ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={styles.mapWebView}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: '#999', fontFamily: 'NotoSansRegular' }}>
              지도 정보 없음
            </Text>
          </View>
        )}
      </View>

      {/* 텍스트 정보 */}
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <LocationIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{address} {detailedAddress}</Text>
        </View>

        <View style={styles.row}>
          <ClockIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{openDays} / {openHours}</Text>
        </View>

        <View style={styles.row}>
          <PhoneIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.text}>{phoneNumber}</Text>
        </View>

        <View style={styles.row}>
          <InstaIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.link}>인스타그램: {instagramLink}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, backgroundColor: '#F4F4F4', alignItems: 'center' },
  title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.01,
    justifyContent: 'center',
  },
  title_text: { fontSize: height * 0.023, color: '#666666', fontFamily: 'NotoSansRegular' },

  mapWrapper: {
    width: width * 0.9,
    height: height * 0.2175,
    backgroundColor: '#B2B2B2',
    marginBottom: height * 0.02,
    overflow: 'hidden',
    borderRadius: 8,
    position: 'relative',
  },
  mapWebView: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: { justifyContent: 'center', alignItems: 'center', flex: 1 },

  infoSection: { width: width * 0.9, marginTop: height * 0.01 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.015 },
  text: { fontSize: 14, color: '#666666', marginLeft: 6, fontFamily: 'NotoSansRegular' },
  link: { fontSize: 14, color: '#3f729b', marginLeft: 6, fontFamily: 'NotoSansRegular' },
});
