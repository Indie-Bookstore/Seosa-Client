import 'react-native-url-polyfill/auto';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Modal, Alert } from 'react-native';
import AuthComponent from '../../components/auth/AuthComponent';
import AuthHeader from '../../components/auth/AuthHeader';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken } from '../../store/authSlice';

const STATUSBAR_HEIGHT = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : StatusBar.currentHeight;

export default function AuthScreen({ navigation }) {
  const dispatch = useDispatch();
  const [showWebView, setShowWebView] = useState(false);

  // 카카오 인가 URL
  const kakaoAuthUrl =
    'https://kauth.kakao.com/oauth/authorize?response_type=code' +
    '&client_id=4244def76486750c5de64d6b7d0e5980' +
    '&scope=profile_image%20account_email' +
    '&state=oRVjpLMTMogzVmGk2ScC_4G7GPh4b6av2IO-zlESILk%3D' +
    '&redirect_uri=https://seosa.o-r.kr/login/oauth2/code/kakao';

  // WebView URL 상태 변화 감지
  const handleNavStateChange = useCallback(async (navState) => {
    const { url } = navState;
    if (url.startsWith('http://10.240.11.153:8081/Auth')) {
      const [, queryString] = url.split('?');
      const params = new URLSearchParams(queryString);
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');

      if (accessToken && refreshToken) {
        try {
          // SecureStore에 토큰 저장
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', refreshToken);

          // Redux 상태 업데이트
          dispatch(setAccessToken(accessToken));
          dispatch(setRefreshToken(refreshToken));

          setShowWebView(false);
          navigation.replace('Main');
        } catch (e) {
          Alert.alert('로그인 오류', '토큰 저장에 실패했습니다.');
        }
      } else {
        Alert.alert('로그인 오류', '토큰을 받아오지 못했습니다.');
      }
    }
  }, [dispatch, navigation]);

  const handleKakaoLoginPress = () => {
    setShowWebView(true);
  };
  const handleLocalRegisterPress = () => navigation.navigate('Register');

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="로그인/회원가입" />
      <AuthComponent
        onKakaoLoginPress={handleKakaoLoginPress}
        onLocalRegisterPress={handleLocalRegisterPress}
      />

      <Modal visible={showWebView} animationType="slide">
        <WebView
          source={{ uri: kakaoAuthUrl }}
          onNavigationStateChange={handleNavStateChange}
          startInLoadingState
          renderLoading={() => <ActivityIndicator style={styles.loader} />}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFEFB',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
