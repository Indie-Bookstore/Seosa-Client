// Auth Screen 메인 컴포넌트

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import ButtonComponent from "../common/button/ButtonComponent";
import InputComponent from "../common/input/InputComponent";
import AlertComponent from "./AlertComponent";
import PasswordInputComponent from "../common/input/PasswordInputComponent";
import api from "../../api/axios";
import { setAccessToken } from "../../store/authSlice";
// expo-secure-store util 함수 (refresh token 저장)
import { setRefreshToken as saveRefreshToken } from "../../utils/tokenStorage";

const AuthComponent = ({
  onKakaoLoginPress,
  onLocalRegisterPress,
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(""); // 로그인 관련 알림 (에러/성공)
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 관련 에러

  const dispatch = useDispatch();

  // 이메일이 비어있지 않고, 비밀번호가 8자 이상일 때 로그인 활성화
  const isLoginEnabled = email.trim() !== "" && password.length >= 8;

  const onLocalLoginPressHandler = async () => {
    if (!isLoginEnabled || isLoading) return;

    setIsLoading(true);
    setLoginError("");
    setPasswordError("");

    const request = {
      email,
      password,
    };

    console.log("🔹 Login Request:", request);

    try {
      // 로그인 엔드포인트 호출
      const response = await api.post("/local/login", request);

      const { accessToken, refreshToken } = response.data;

      // Expo SecureStore에 refresh token 저장
      await saveRefreshToken(refreshToken);
      // Redux 스토어에 access token 저장
      dispatch(setAccessToken(accessToken));

      // 로그인 성공 메시지 설정 (녹색)
      setLoginError("로그인에 성공했습니다!");

      // 로그인 성공 후 스택 초기화 및 Main 화면으로 이동
    navigation.reset({
      index: 0, // 활성화할 경로의 인덱스
      routes: [{ name: "Main" }], // 이동할 경로 설정
    });
    } catch (error) {
      console.error("🚨 Login error:", error);
      if (error.response) {
        const { code, message } = error.response.data;
        switch (code) {
          case "USER_NOT_FOUND":
            setLoginError("존재하지 않는 이메일입니다.");
            break;
          case "INVALID_PASSWORD":
            setPasswordError("잘못된 비밀번호입니다.");
            break;
          case "VALIDATION_FAILED":
          case "INVALID_REQUEST":
          default:
            setLoginError(message || "잘못된 요청입니다.");
            break;
        }
      } else if (error.request) {
        setLoginError(
          "서버에 연결할 수 없습니다. 네트워크 설정을 확인하거나 잠시 후 다시 시도해주세요."
        );
      } else {
        setLoginError("예상치 못한 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.kakaoButtonContainer}>
          <ButtonComponent
            onPress={onKakaoLoginPress}
            description="카카오로 3초만에 시작하기"
            btnType="btn-kakao"
          />
        </View>
        <View>
          <InputComponent
            title="아이디(이메일)"
            placeholder="abc@email.com"
            backgroundColor="white"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        {/* 이메일 관련 알림 */}
        {loginError ? (
          <AlertComponent
            description={loginError}
            isError={!loginError.includes("성공")}
          />
        ) : null}

        <View style={styles.passwordInputContainer}>
          <PasswordInputComponent
            title="비밀번호"
            backgroundColor="white"
            placeholder="8자 이상의 비밀번호"
            onChangeText={setPassword}
            value={password}
          />
        </View>
        {/* 비밀번호 관련 알림 */}
        {passwordError ? (
          <AlertComponent description={passwordError} isError={true} />
        ) : null}
      </View>

      <View style={styles.loginButtonContainer}>
        <ButtonComponent
          onPress={onLocalLoginPressHandler}
          description={isLoading ? "로그인 중..." : "로그인"}
          btnType={isLoginEnabled && !isLoading ? "btn-green" : "btn-gray"}
          disabled={!isLoginEnabled || isLoading}
        />
      </View>
      <View style={styles.registerButtonContainer}>
        <ButtonComponent
          btnType="btn-greenbd"
          onPress={onLocalRegisterPress}
          description="이메일로 회원가입하기"
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: Dimensions.get("window").height * 0.5075,
    marginTop: Dimensions.get("window").height * 0.02,
  },
  topContainer: {
    height: Dimensions.get("window").height * 0.3025,
  },
  kakaoButtonContainer: {
    marginBottom: Dimensions.get("window").height * 0.0375,
  },
  passwordInputContainer: {
    marginTop: Dimensions.get("window").height * 0.0125,
  },
  loginButtonContainer: {
    marginTop: Dimensions.get("window").height * 0.04375,
  },
  registerButtonContainer: {
    marginTop: Dimensions.get("window").height * 0.0125,
  },
  forgotPasswordContainer: {
    marginTop: Dimensions.get("window").height * 0.025,
  },
  forgotPasswordText: {
    color: "#666666",
    fontSize: Dimensions.get("window").height * 0.015,
    fontFamily: "NotoSans-Regular",
    fontWeight: "400",
  },
});

export default AuthComponent;
