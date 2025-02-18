// src/components/KakaoLogin.js
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const REST_API_KEY = process.env.EXPO_PUBLIC_REST_API_KEY;
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI;

const KakaoLogin = ({ onCodeReceived }) => {
  const getCode = (target) => {
    const exp = "code=";
    const condition = target.indexOf(exp);
    if (condition !== -1) {
      const requestCode = target.substring(condition + exp.length);
      onCodeReceived(requestCode);
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ flex: 1 }}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        javaScriptEnabled
        onNavigationStateChange={(navState) => {
          if (navState.url.includes(REDIRECT_URI)) {
            getCode(navState.url);
          }
        }}
      />
    </View>
  );
};

export default KakaoLogin;