// src/components/auth/RegisterComponent.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import api from "../../api/axios.js";
import ButtonComponent from "../common/button/ButtonComponent";
import AuthAlertComponent from "../auth/AuthAlertComponent";
import PasswordInputComponent from "../common/input/PasswordInputComponent";
import ShortInputComponent from "../common/input/ShortInputComponent";
import InfoInputComponent from "../common/input/InfoInputComponent";
import PasswordInfoComponent from "../common/info/passwordInfoComponent";

const RegisterComponent = ({ onLocalLoginPress }) => {

  // 사용자 input 상태
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  // 버튼 텍스트 상태
  const [nicknameButtonText, setNicknameButtonText] = useState("중복확인");
  const [emailButtonText, setEmailButtonText] = useState("중복확인");

  // 로딩 상태
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // 에러 메시지 상태
  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
    password: "",
    code: "",
    general: "",
  });

  // 검증 상태
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  // 입력 가능 상태
  const [canCheckNickname, setCanCheckNickname] = useState(false);
  const [canCheckEmail, setCanCheckEmail] = useState(false);

  // 비밀번호 검증 상태
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  // 닉네임 변경 핸들러
  const handleNicknameChange = (text) => {
    setNickname(text);
    if (isNicknameVerified) {
      setIsNicknameVerified(false);
      setNicknameButtonText("중복확인");
    }
    setCanCheckNickname(text.trim().length >= 2);
    // 닉네임 오류 초기화
    setErrors((prev) => ({ ...prev, nickname: "" }));
  };

  // 이메일 변경 핸들러
  const handleEmailChange = (text) => {
    setEmail(text);
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setEmailButtonText("중복확인");
    }
    setCanCheckEmail(text.trim().includes("@"));
    // 이메일 오류 초기화
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    try {
      setIsCheckingNickname(true);
      await api.get(`/signinCheck/nicknameCheck`, {
        params: { nickname },
        skipAuth: true,
      });
      setErrors((prev) => ({ ...prev, nickname: "" }));
      setIsNicknameVerified(true);
      setNicknameButtonText("확인 완료");
    } catch (error) {
      handleApiError(error, "nickname");
      setIsNicknameVerified(false);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    try {
      setIsCheckingEmail(true);
      await api.get(`/signinCheck/emailCheck`, {
        params: { email },
        skipAuth: true,
      });
      setErrors((prev) => ({ ...prev, email: "" }));
      setIsEmailVerified(true);
      setEmailButtonText("확인 완료");
    } catch (error) {
      handleApiError(error, "email");
      setIsEmailVerified(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 비밀번호 검증
  useEffect(() => {
    const lengthValid = password.length >= 8;
    const letterValid = /[a-zA-Z]/.test(password);
    const numberValid = /[0-9]/.test(password);

    // 비밀번호, 비밀번호 확인 일치 검증
    const passwordsMatch = password === confirmPassword;

    setIsLengthValid(lengthValid);
    setHasLetter(letterValid);
    setHasNumber(numberValid);

    // 비밀번호 불일치 오류 메시지 설정
    setErrors((prev) => ({
      ...prev,
      password:
        !passwordsMatch && confirmPassword.length > 0
          ? "비밀번호가 일치하지 않습니다."
          : "",
    }));

    setIsPasswordVerified(
      lengthValid && letterValid && numberValid && passwordsMatch // 수정: 변수명 변경
    );
  }, [password, confirmPassword]);

  // 전체체 API 오류 처리
  const handleApiError = (error, field) => {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";

    if (error.response?.data) {
      const { code, message } = error.response.data;
      errorMessage = message;

      switch (code) {
        case "DUPLICATE_NICKNAME":
        case "DUPLICATE_EMAIL":
          errorMessage = message;
          break;
        case "VALIDATION_FAILED":
          errorMessage = message.replace(/.*\{.*?=(.*?)\}.*/, "$1");
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  // 회원가입 처리
  const handleRegister = async () => {
    if (!isAllValid) return;

    try {
      await api.post(
        "/register",
        {
          email,
          nickname,
          password,
          userRoleCode: authCode || "",
        },
        { skipAuth: true }
      );

      onLocalLoginPress();
    } catch (error) {
      handleApiError(error, "general");
    }
  };

  // 최종 검증 상태 관리
  const isAllValid =
    isNicknameVerified && isEmailVerified && isPasswordVerified;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* 닉네임 입력 섹션 */}
        <ShortInputComponent
          title="닉네임"
          placeholder="닉네임을 입력하세요."
          onChangeText={handleNicknameChange}
          value={nickname}
          required
          backgroundColor="white"
          onDuplicateCheck={handleNicknameCheck}
          description={nicknameButtonText}
          duplicateBtnType={
            isNicknameVerified
              ? "btn-gray"
              : canCheckNickname
              ? "btn-green"
              : "btn-gray"
          }
          disabled={
            isCheckingNickname || !canCheckNickname || isNicknameVerified
          }
        />
        <AuthAlertComponent description={errors.nickname} />

        {/* 이메일 입력 섹션 */}
        <ShortInputComponent
          title="이메일(아이디)"
          placeholder="abc@email.com"
          onChangeText={handleEmailChange}
          value={email}
          required
          description={emailButtonText}
          onDuplicateCheck={handleEmailCheck}
          backgroundColor="white"
          duplicateBtnType={
            isEmailVerified
              ? "btn-gray"
              : canCheckEmail
              ? "btn-green"
              : "btn-gray"
          }
          disabled={isCheckingEmail || !canCheckEmail || isEmailVerified}
        />
        <AuthAlertComponent description={errors.email} />

        {/* 비밀번호 입력 섹션 */}
        <View style={styles.passwordSection}>
          <PasswordInputComponent
            title="비밀번호"
            placeholder="8자 이상의 비밀번호"
            required={true}
            onChangeText={setPassword}
            value={password}
            backgroundColor="white"
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
        </View>
        <AuthAlertComponent description={errors.password} />

        {/* 인증번호 입력 */}
        <InfoInputComponent
          title="인증번호(선택)"
          placeholder="인증번호 입력"
          value={authCode}
          onChangeText={setAuthCode}
        />
        <AuthAlertComponent description={errors.code} />
        <AuthAlertComponent description={errors.general} />
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
