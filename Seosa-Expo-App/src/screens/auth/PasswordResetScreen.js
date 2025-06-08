// src/screens/auth/PasswordResetScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import Constants from "expo-constants";
import PasswordInputComponent from "../../components/common/input/PasswordInputComponent";
import PasswordInfoComponent from "../../components/common/info/passwordInfoComponent";
import ButtonComponent from "../../components/common/button/ButtonComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import api from "../../api/axios";

const { width, height } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const PasswordResetScreen = ({ navigation }) => {
  // 상태 관리
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 검증 상태
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // 비밀번호 유효성 검사
  useEffect(() => {
    const lengthValid = password.length >= 8;
    const letterValid = /[a-zA-Z]/.test(password);
    const numberValid = /[0-9]/.test(password);
    const specialCharValid = /[!@#$%^&*]/.test(password);
    const passwordsMatch = password === confirmPassword;

    setIsLengthValid(lengthValid);
    setHasLetter(letterValid);
    setHasNumber(numberValid);
    setHasSpecialChar(specialCharValid);

    setErrors((prev) => ({
      ...prev,
      password:
        !passwordsMatch && confirmPassword.length > 0
          ? "비밀번호가 일치하지 않습니다."
          : "",
    }));

    setIsPasswordVerified(
      lengthValid && letterValid && numberValid && passwordsMatch
    );
  }, [password, confirmPassword]);

  // 비밀번호 변경 요청
  const handlePasswordReset = async () => {
    if (!isPasswordVerified || isLoading) return;

    // 초기화
    setErrors({ password: "", general: "" });
    setIsLoading(true);

    try {
      // PATCH /user/password 호출
      await api.patch("/user/password", {
        newPassword1: password,
        newPassword2: confirmPassword,
      });
      // 성공 시 완료 화면으로 이동
      navigation.replace("ResetDone");
    } catch (error) {
      // 서버 에러 코드 별 에러 메세지 세팅
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      if (error.response?.data) {
        const { code, message } = error.response.data;
        switch (code) {
          case "PASSWORD_MISMATCH":
            errorMessage = "비밀번호가 일치하지 않습니다.";
            break;
          case "VALIDATION_FAILED":
            errorMessage =
              "비밀번호 요구사항을 확인해주세요 (최소 8자, 영문+숫자 조합)";
            break;
          default:
            errorMessage = message;
        }
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="비밀번호 재설정" backOnPress={handleBack} />

      <View style={styles.pwcontainer}>
        <PasswordInputComponent
          title="비밀번호를 재설정해주세요."
          placeholder="새로운 비밀번호"
          backgroundColor="white"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setShowPasswordInfo(true)}
        />

        <View style={styles.spacer} />
        {showPasswordInfo && (
          <PasswordInfoComponent
            isLengthValid={isLengthValid}
            hasLetter={hasLetter}
            hasNumber={hasNumber}
          />
        )}

        <PasswordInputComponent
          placeholder="비밀번호 확인"
          backgroundColor="white"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />

        {errors.password && <AlertComponent description={errors.password} isError={true} />}
        {errors.general && <AlertComponent description={errors.general} isError={true} />}
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          btnType={isPasswordVerified ? "btn-green" : "btn-gray"}
          onPress={handlePasswordReset}
          description={isLoading ? "처리 중..." : "비밀번호 변경"}
          disabled={!isPasswordVerified || isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFFEFB",
    flex: 1,
    alignItems: "center",
  },
  pwcontainer: {
    marginTop: height * 0.02,
    width: width * 0.9,
  },
  spacer: {
    height: height * 0.01,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    width: "90%",
  },
});

export default PasswordResetScreen;
