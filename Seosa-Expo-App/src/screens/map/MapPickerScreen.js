import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const KAKAO_JS_KEY = 'dc13f582ad6853f325112b88e5145317';

export default function MapPickerScreen({ navigation, route }) {
  // HTML with explicit map container width/height and viewport meta
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Kakao Map Picker</title>
      <style>
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
        }
        #map {
          width: 100%; height: 100%;
        }
        #confirm {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          padding: 10px 20px; background: #fff; border: 1px solid #888; border-radius: 4px;
          font-size: 16px;
        }
      </style>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services"></script>
    </head>
    <body>
      <div id="map"></div>
      <button id="confirm">위치 선택</button>
      <script>
        const mapContainer = document.getElementById('map');
        const mapOption = { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 4 };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        let selectedPos = map.getCenter();
        const marker = new kakao.maps.Marker({ map });

        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
          selectedPos = mouseEvent.latLng;
          marker.setPosition(selectedPos);
        });

        document.getElementById('confirm').addEventListener('click', () => {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(
            selectedPos.getLng(), selectedPos.getLat(),
            (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ address, lat: selectedPos.getLat(), lng: selectedPos.getLng() })
                );
              }
            }
          );
        });
      </script>
    </body>
    </html>
  `;

  const onMessage = (event) => {
    const { address, lat, lng } = JSON.parse(event.nativeEvent.data);
    const { targetKey } = route.params;
    navigation.emit({
      type: 'mapSelect',
      data: { address, lat, lng },
      target: targetKey,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.flex}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        style={styles.flex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }
});
