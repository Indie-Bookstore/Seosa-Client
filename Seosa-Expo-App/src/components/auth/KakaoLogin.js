// src/components/auth/KakaoLogin.js
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setAccessToken, setIsTemporary } from '../../store/authSlice';
import { setRefreshToken } from '../../utils/tokenStorage';

const REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI;

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

const KakaoLogin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLoginResponse = (url) => {
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);
    
    const message = params.get('message');  // 응답 메시지
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      const isTemporary = message === '회원가입을 완료해주세요'; // 임시회원 여부 판단

      dispatch(setAccessToken(accessToken));
      dispatch(setIsTemporary(isTemporary));
      setRefreshToken(refreshToken);

      if (isTemporary) {
        navigation.navigate('SignupScreen'); // 기존의 SignupScreen으로 이동
      } else {
        navigation.navigate('MainScreen'); // 메인 화면 이동
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: KAKAO_AUTH_URL }}
        javaScriptEnabled
        onNavigationStateChange={(navState) => {
          if (navState.url.startsWith(REDIRECT_URI)) {
            handleLoginResponse(navState.url);
          }
        }}
      />
    </View>
  );
};

export default KakaoLogin;
