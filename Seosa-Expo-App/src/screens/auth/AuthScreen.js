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
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken, setIsTemporary } from "../../store/authSlice";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

export default function AuthScreen({ navigation }) {
  const dispatch = useDispatch();
  const [showWebView, setShowWebView] = useState(false);

  // 카카오 인가 URL
  const kakaoAuthUrl =
    "https://kauth.kakao.com/oauth/authorize?response_type=code" +
    "&client_id=4244def76486750c5de64d6b7d0e5980" +
    "&scope=profile_image%20account_email" +
    "&state=oRVjpLMTMogzVmGk2ScC_4G7GPh4b6av2IO-zlESILk%3D" +
    "&redirect_uri=https://seosa.o-r.kr/login/oauth2/code/kakao";

  // WebView URL 상태 변화 감지
  const handleNavStateChange = useCallback(
    async (navState) => {
      const { url } = navState;
      console.log("🔍 WebView navState:", navState);
      console.log("🔍 URL:", url);
      if (url.startsWith("http://10.240.11.153:8081/Auth")) {
        const [, queryString] = url.split("?");
        console.log("🔍 queryString:", queryString);  
        const params = new URLSearchParams(queryString);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const message = params.get("message"); // 임시회원 메시지
        console.log("🔍 Parsed params:", {
        accessToken,
        refreshToken,
        message,
      });

        if (accessToken && refreshToken) {
          try {
            await SecureStore.setItemAsync("accessToken", accessToken);
            await SecureStore.setItemAsync("refreshToken", refreshToken);

            dispatch(setAccessToken(accessToken));
            dispatch(setRefreshToken(refreshToken));

            // 임시회원 여부 판단
            const isTemporary = message === "회원가입을 완료해주세요";
            dispatch(setIsTemporary(isTemporary));

            setShowWebView(false);
            // 임시회원이면 온보딩, 아니면 메인으로
            if (isTemporary) {
              navigation.replace("Onboarding");
            } else {
              navigation.replace("Home");
            }
          } catch (e) {
            Alert.alert("로그인 오류", "토큰 저장에 실패했습니다.");
          }
        } else {
          Alert.alert("로그인 오류", "토큰을 받아오지 못했습니다.");
        }
      }
    },
    [dispatch, navigation]
  );

  const handleKakaoLoginPress = () => {
    setShowWebView(true);
  };
  const handleLocalRegisterPress = () => navigation.navigate("Register");

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
