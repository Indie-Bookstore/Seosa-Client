// src/screens/auth/AuthCodeScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import Constants from "expo-constants";
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { navigationRef, navigate } from "../../utils/nav/RootNavigation";

const { width, height } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const AuthCodeScreen = ({ navigation }) => {
  // 혹시 모르니 있을 때 넘겨줌
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 타이머, 플래그, 입력값, 메시지/에러 상태
  const [timer, setTimer] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [sendCodeMessage, setSendCodeMessage] = useState("");
  const [sendCodeError, setSendCodeError] = useState("");
  const [checkCodeMessage, setCheckCodeMessage] = useState("");
  const [checkCodeError, setCheckCodeError] = useState("");

  // 타이머 카운트다운
  useEffect(() => {
    if (timer > 0) {
      const iv = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(iv);
    }
  }, [timer]);

  // 타이머 만료 시 처리
  useEffect(() => {
    if (timer === 0 && isCodeSent) {
      setCheckCodeError("인증 시간이 만료되었습니다. 재전송 해주세요.");
      setVerificationCode("");
      setIsCodeSent(false);
    }
  }, [timer]);

  // 언마운트 시 초기화
  useEffect(() => () => {
    setTimer(0);
    setIsCodeSent(false);
  }, []);

  // 인증번호 전송 핸들러
  const handleSendVerificationCode = async () => {
    setSendCodeMessage("");
    setSendCodeError("");
    if (!email.trim()) {
      setSendCodeError("이메일을 입력하세요.");
      return;
    }
    // 토큰이 있으면 헤더 추가
    const config = {};
    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken}` };
    }

    try {
      const res = await api.get(
        `/user/sendVerificationCode?email=${encodeURIComponent(email)}`,
        config
      );
      setSendCodeMessage(res.data.message);
      setIsCodeSent(true);
      setTimer(300);
    } catch (err) {
      console.error("인증번호 전송 에러:", err);
      setIsCodeSent(false);
      setTimer(0);
      const code = err.response?.data?.code;
      if (code === "USER_EMAIL_MISMATCH") {
        setSendCodeError("입력한 이메일이 회원 정보와 일치하지 않습니다.");
      } else if (code === "VALIDATION_FAILED" || code === "INVALID_REQUEST") {
        setSendCodeError(err.response.data.message);
      } else {
        setSendCodeError("서버에 연결할 수 없습니다.");
      }
    }
  };

  // 인증번호 확인 핸들러
  const handleCheckVerificationCode = async () => {
    setCheckCodeMessage("");
    setCheckCodeError("");
    if (!verificationCode.trim()) {
      setCheckCodeError("인증번호를 입력하세요.");
      return;
    }
    const config = {};
    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken}` };
    }

    try {
      const res = await api.get(
        `/user/checkVerificationCode?verificationCode=${encodeURIComponent(verificationCode)}`,
        config
      );
      setCheckCodeMessage(res.data.message);
      // 확인 성공 시 비밀번호 재설정 화면으로 이동
      if (navigationRef.isReady()) {
        navigate("PasswordReset");
      }
    } catch (err) {
      console.error("인증번호 확인 에러:", err);
      const code = err.response?.data?.code;
      if (code === "VERIFICATION_CODE_EXPIRED") {
        setCheckCodeError("인증번호 입력 시간이 만료되었습니다.");
      } else if (code === "VERIFICATION_CODE_MISMATCH") {
        setCheckCodeError("입력한 인증번호가 이메일로 보낸 인증번호와 일치하지 않습니다.");
      } else {
        setCheckCodeError("서버에 연결할 수 없습니다.");
      }
    }
  };

  // 남은 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.screen}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="비밀번호 재설정" backOnPress={() => navigation.goBack()} />

      <View style={styles.pwcontainer}>
        {/* 이메일 입력 & 전송 */}
        <ShortInputComponent
          title="본인인증"
          placeholder="아이디(이메일) 입력"
          description="인증번호 전송"
          value={email}
          onChangeText={setEmail}
          onDuplicateCheck={handleSendVerificationCode}
          duplicateBtnType={email.trim() ? "btn-green" : "btn-gray"}
          disabled={timer > 0}
        />
        {sendCodeError ? (
          <AlertComponent description={sendCodeError} isError={true} />
        ) : sendCodeMessage ? (
          <AlertComponent description={sendCodeMessage} isError={false} />
        ) : (
          <View style={styles.space} />
        )}

        {/* 인증번호 입력 & 확인 */}
        <ShortInputComponent
          placeholder="인증번호 입력"
          description="본인인증"
          value={verificationCode}
          onChangeText={setVerificationCode}
          onDuplicateCheck={handleCheckVerificationCode}
          duplicateBtnType={verificationCode.trim() ? "btn-green" : "btn-gray"}
          disabled={!isCodeSent || timer <= 0}
          rightContent={
            isCodeSent &&
            timer > 0 && (
              <Text
                style={{
                  color: timer <= 60 ? "#FF0000" : "#666666",
                  fontSize: 14,
                  fontFamily: "NotoSans-Regular",
                }}
              >
                {formatTime(timer)}
              </Text>
            )
          }
        />
        {checkCodeError ? (
          <AlertComponent description={checkCodeError} isError={true} />
        ) : checkCodeMessage ? (
          <AlertComponent description={checkCodeMessage} isError={false} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFEFB",
    alignItems: "center",
  },
  pwcontainer: {
    marginTop: height * 0.02,
    height: height * 0.16,
    width: width * 0.9,
  },
  space: {
    height: height * 0.01,
  },
});

export default AuthCodeScreen;
