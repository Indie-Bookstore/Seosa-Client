// src/screens/auth/AuthScreen.js
import "react-native-url-polyfill/auto";
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  Platform,
} from "react-native";
import AuthComponent from "../../components/auth/AuthComponent";
import AuthHeader from "../../components/auth/AuthHeader";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";

import { useDispatch } from "react-redux";
import {
  setAccessToken as setReduxAccess,
  setRefreshToken as setReduxRefresh,
} from "../../store/authSlice";

import {
  setAccessToken as storeAccessToken,
  setRefreshToken as storeRefreshToken,
} from "../../utils/tokenStorage";

import { navigate } from "../../utils/nav/RootNavigation";

const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [showWebView, setShowWebView] = useState(false);

  // 카카오 인가 URL
  const kakaoAuthUrl = useMemo(
    () =>
      "https://kauth.kakao.com/oauth/authorize?response_type=code" +
      "&client_id=4244def76486750c5de64d6b7d0e5980" +
      "&scope=profile_image%20account_email" +
      "&state=oRVjpLMTMogzVmGk2ScC_4G7GPh4b6av2IO-zlESILk%3D" +
      "&redirect_uri=https://seosa.o-r.kr/login/oauth2/code/kakao",
    []
  );

  /**
   * URL에서 accessToken/refreshToken 추출 후 저장 & 이동
   */
  const tryHandleTokensFromUrl = useCallback(
    async (url) => {
      try {
        if (!url) return false;

        // 쿼리스트링 파싱 (ex: seosa://onboarding?accessToken=...&refreshToken=...)
        const qIndex = url.indexOf("?");
        if (qIndex === -1) return false;

        const qs = url.substring(qIndex + 1);
        const params = new URLSearchParams(qs);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (!(accessToken && refreshToken)) return false;

        // 1) SecureStore 저장
        await storeAccessToken(accessToken);
        await storeRefreshToken(refreshToken);

        // 2) Redux 저장
        dispatch(setReduxAccess(accessToken));
        dispatch(setReduxRefresh(refreshToken));

        // 3) WebView 닫기 & 홈 이동
        setShowWebView(false);
        navigate("Home");
        return true;
      } catch (e) {
        console.error("🔴 토큰 처리 오류:", e);
        Alert.alert("로그인 오류", "토큰 처리에 실패했습니다.");
        return false;
      }
    },
    [dispatch]
  );

  /**
   * 허용할 URL 여부 (http/https/about:blank/data:만 허용)
   * - seosa:// 은 우리가 직접 처리
   * - intent://, kakaokompassauth:// 등 기타 스킴은 차단(Expo Go에서 열 수 없음)
   */
  const isHttpLike = (url) =>
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("about:blank") ||
    url.startsWith("data:");

  /**
   * WebView의 네비게이션 인터셉트
   * - seosa:// => 토큰 직접 파싱(가로채고 WebView 진행 중단)
   * - http/https/about/data => 허용
   * - 그 외(intent://, kakaokompassauth:// 등) => 차단(무시)
   */
  const onShouldStartLoadWithRequest = useCallback(
    (request) => {
      const { url } = request;

      // 최종 커스텀 스킴(딥링크)
      if (url.startsWith("seosa://")) {
        tryHandleTokensFromUrl(url);
        return false; // WebView가 열지 않도록 중단
      }

      // http/https/about/data 만 통과
      if (isHttpLike(url)) {
        return true;
      }

      // intent://, kakaokompassauth://, kakao[app]:// 등은 Expo Go에서 처리 불가 → 차단
      console.log("🚫 Blocked non-http(s) scheme:", url);
      return false;
    },
    [tryHandleTokensFromUrl]
  );

  /**
   * 보조: 혹시 백엔드가 https URL에 토큰을 붙여 주는 경우까지 커버
   */
  const handleNavStateChange = useCallback(
    async (navState) => {
      const { url } = navState;
      console.log("🔍 WebView navState:", navState);
      console.log("🔍 URL:", url);

      if (url.includes("accessToken=") && url.includes("refreshToken=")) {
        await tryHandleTokensFromUrl(url);
      }
    },
    [tryHandleTokensFromUrl]
  );

  const handleError = useCallback((syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error("🔴 WebView error:", nativeEvent);
    Alert.alert("로그인 오류", "로그인 페이지를 불러오지 못했습니다.");
  }, []);

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
          originWhitelist={["*"]}                // 리다이렉트 폭넓게 허용
          javaScriptEnabled                      // 명시적으로 활성화
          domStorageEnabled                      // 스토리지 사용
          sharedCookiesEnabled                   // SSO/쿠키 공유(안드로이드)
          thirdPartyCookiesEnabled               // 3rd-party 쿠키 허용(안드로이드)
          setSupportMultipleWindows={false}      // window.open 방지(한 WebView에서 처리)
          mixedContentMode="always"              // 혼합콘텐츠 허용(보수적)
          onNavigationStateChange={handleNavStateChange}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onError={handleError}
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
