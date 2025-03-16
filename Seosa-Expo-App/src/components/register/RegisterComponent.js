import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import ButtonComponent from "../common/button/ButtonComponent";
import AuthAlertComponent from "../auth/AuthAlertComponent";
import PasswordInputComponent from "../common/input/PasswordInputComponent";
import ShortInputComponent from "../common/input/ShortInputComponent";
import InfoInputComponent from "../common/input/InfoInputComponent";
import PasswordInfoComponent from "../common/info/passwordInfoComponent";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://your-backend-url.com";

const RegisterComponent = ({ onLocalLoginPress }) => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 에러 상태
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // 검증 상태
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // 비밀번호 추가 검증 상태
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  // 닉네임 검증
  const handleNicknameCheck = async () => {
    if (!nickname.trim()) return;
    try {
      await axios.post(`${BASE_URL}/signinCheck/nicknameCheck`, { nickname });
      setNicknameError("");
      setIsNicknameVerified(true);
    } catch (error) {
      handleApiError(error, setNicknameError);
      setIsNicknameVerified(false);
    }
  };

  // 이메일 검증
  const handleEmailCheck = async () => {
    if (!email.trim()) return;
    try {
      await axios.post(`${BASE_URL}/signinCheck/emailCheck`, { email });
      setEmailError("");
      setIsEmailVerified(true);
    } catch (error) {
      handleApiError(error, setEmailError);
      setIsEmailVerified(false);
    }
  };

  // 비밀번호 검증
  useEffect(() => {
    const validatePassword = () => {
      // 기본 유효성 검사
      const basicValidation =
        password === confirmPassword && password.length >= 8;

      // 추가 유효성 검사
      const lengthValid = password.length >= 8;
      const letterValid = /[a-zA-Z]/.test(password);
      const numberValid = /\d/.test(password);

      setIsLengthValid(lengthValid);
      setHasLetter(letterValid);
      setHasNumber(numberValid);

      // 최종 비밀번호 검증 상태
      setIsPasswordVerified(
        basicValidation && lengthValid && letterValid && numberValid
      );
    };

    if (password || confirmPassword) {
      setShowPasswordInfo(true);
      validatePassword();
    } else {
      setShowPasswordInfo(false);
    }
  }, [password, confirmPassword]);

  // 공통 에러 처리
  const handleApiError = (error, setter) => {
    const response = error.response?.data;
    setter(response?.message || "서버 연결에 실패했습니다.");
  };

  // 회원가입 처리
  const handleRegister = async () => {
    if (!isAllValid) return;

    try {
      await axios.post(`${BASE_URL}/register`, {
        email,
        nickname,
        password,
        authCode,
      });
      onLocalLoginPress();
    } catch (error) {
      const response = error.response?.data;
      setGeneralError(response?.message || "회원가입에 실패했습니다.");
    }
  };

  // 최종 검증 상태
  const isAllValid =
    isNicknameVerified &&
    isEmailVerified &&
    isPasswordVerified &&
    isLengthValid &&
    hasLetter &&
    hasNumber;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* 닉네임 입력 필드 */}
        <ShortInputComponent
          title="닉네임"
          placeholder="닉네임을 입력하세요."
          onChangeText={setNickname}
          value={nickname}
          required={true}
          onDuplicateCheck={handleNicknameCheck}
          description="중복확인"
          duplicateBtnType={nickname ? "btn-green" : "btn-gray"}
        />
        <AuthAlertComponent description={nicknameError} />

        {/* 이메일 입력 필드 */}
        <ShortInputComponent
          title="이메일(아이디)"
          placeholder="abc@email.com"
          onChangeText={setEmail}
          value={email}
          required={true}
          description="중복확인"
          onDuplicateCheck={handleEmailCheck}
          duplicateBtnType={email ? "btn-green" : "btn-gray"}
        />
        <AuthAlertComponent description={emailError} />

        {/* 비밀번호 입력 섹션 */}
        <View style={styles.passwordSection}>
          <PasswordInputComponent
            title="비밀번호"
            placeholder="8자 이상의 비밀번호"
            required={true}
            onChangeText={setPassword}
            value={password}
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
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
        </View>
        <AuthAlertComponent description={passwordError} />

        {/* 인증번호 입력 필드 */}
        <InfoInputComponent
          title="인증번호(선택)"
          placeholder="인증번호 입력"
          value={authCode}
          onChangeText={setAuthCode}
        />
        <AuthAlertComponent description={codeError} />
        <AuthAlertComponent description={generalError} />
      </View>

      {/* 회원가입 버튼 */}
      <View style={styles.buttonContainer}>
        <ButtonComponent
          btnType={isAllValid ? "btn-green" : "btn-gray"}
          onPress={handleRegister}
          description="회원가입 완료"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Dimensions.get("window").height * 0.02,
  },
  formContainer: {
    width: "90%",
    height: Dimensions.get("window").height * 0.7,
  },
  passwordSection: {
    marginTop: Dimensions.get("window").height * 0.02,
  },
  spacer: {
    height: Dimensions.get("window").height * 0.01,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    width: "90%",
  },
});

export default RegisterComponent;
