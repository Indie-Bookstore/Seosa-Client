// src/screens/auth/AuthScreen.js
import "react-native-url-polyfill/auto";
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import AuthComponent from "../../components/auth/AuthComponent";
import AuthHeader from "../../components/auth/AuthHeader";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";

import { useDispatch } from "react-redux";
import { setAccessToken as setReduxAccess, setRefreshToken as setReduxRefresh } from "../../store/authSlice";

import { setAccessToken as storeAccessToken, setRefreshToken as storeRefreshToken } from "../../utils/tokenStorage";

import { navigate } from "../../utils/nav/RootNavigation";

const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [showWebView, setShowWebView] = useState(false);

  // 카카오 인가 URL
  const kakaoAuthUrl =
    "https://kauth.kakao.com/oauth/authorize?response_type=code" +
    "&client_id=4244def76486750c5de64d6b7d0e5980" +
    "&scope=profile_image%20account_email" +
    "&state=oRVjpLMTMogzVmGk2ScC_4G7GPh4b6av2IO-zlESILk%3D" +
    "&redirect_uri=https://seosa.o-r.kr/login/oauth2/code/kakao";

  const handleNavStateChange = useCallback(
    async (navState) => {
      const { url } = navState;
      console.log("🔍 WebView navState:", navState);
      console.log("🔍 URL:", url);

      if (url.includes("accessToken=") && url.includes("refreshToken=")) {
        const [, queryString] = url.split("?");
        const params = new URLSearchParams(queryString);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (accessToken && refreshToken) {
          try {
            // 1) SecureStore에 토큰 저장 (헬퍼 함수 사용)
            await storeAccessToken(accessToken);
            await storeRefreshToken(refreshToken);

            // 2) Redux에 토큰 저장
            dispatch(setReduxAccess(accessToken));
            dispatch(setReduxRefresh(refreshToken));
            console.log(accessToken);

            // 3) WebView 닫기
            setShowWebView(false);

            // 4) 홈 화면으로 이동
            navigate("Home");
          } catch (e) {
            console.error("🔴 토큰 저장 오류:", e);
            Alert.alert("로그인 오류", "토큰 저장에 실패했습니다.");
          }
        } else {
          Alert.alert("로그인 오류", "토큰을 받아오지 못했습니다.");
        }
      }
    },
    [dispatch]
  );

  const handleKakaoLoginPress = () => {
    setShowWebView(true);
  };

  const handleLocalRegisterPress = () => {
    navigate("Register");
  };

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFEFB",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});
