import React, { useState, useEffect } from "react";
import { View, Platform, StyleSheet, Dimensions, Text } from "react-native"; // Text 추가
import AuthHeader from "../../components/auth/AuthHeader";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import { useSelector } from "react-redux";
import api from "../../api/axios";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

const AuthCodeScreen = ({navigation}) => {
  
  // 타이머 상태
  const [timer, setTimer] = useState(0);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 타이머 관리
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 타이머 만료 처리
  useEffect(() => {
    if (timer === 0 && isCodeSent) {
      setCheckCodeError("인증 시간이 만료되었습니다. 재전송 해주세요.");
      setVerificationCode("");
      setIsCodeSent(false);
    }
  }, [timer]);

  // 컴포넌트 정리 (새로 추가)
  useEffect(() => {
    return () => {
      setTimer(0);
      setIsCodeSent(false);
    };
  }, []);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [sendCodeMessage, setSendCodeMessage] = useState("");
  const [sendCodeError, setSendCodeError] = useState("");

  const [checkCodeMessage, setCheckCodeMessage] = useState("");
  const [checkCodeError, setCheckCodeError] = useState("");

  // 인증번호 전송 핸들러
  const handleSendVerificationCode = async () => {
    setSendCodeMessage("");
    setSendCodeError("");

    if (!email.trim()) {
      setSendCodeError("이메일을 입력하세요.");
      return;
    }

    try {
      const response = await api.get(`/user/sendVerificationCode?email=${email}`);
      setSendCodeMessage(response.data.message);
      setIsCodeSent(true);
      setTimer(300); // 타이머 시작
    } catch (error) {
      console.error("인증번호 전송 에러:", error);
      setIsCodeSent(false);
      setTimer(0);
      if (error.response) {
        setSendCodeError(error.response.data.message);
      } else {
        setSendCodeError("서버에 연결할 수 없습니다.");
      }
    }
  };

  /* 
  const handleCheckVerificationCode = async () => {
    setCheckCodeMessage("");
    setCheckCodeError("");

    if (!verificationCode.trim()) {
      setCheckCodeError("인증번호를 입력하세요.");
      return;
    }

    try {
      const response = await api.get(
        `/user/checkVerificationCode?verificationCode=${verificationCode}`}
      );
      setCheckCodeMessage(response.data.message);
    } catch (error) {
      console.error("인증번호 확인 에러:", error);
      if (error.response) {
        setCheckCodeError(error.response.data.message);
      } else {
        setCheckCodeError("서버에 연결할 수 없습니다.");
      }
    }
  };
  */

  const handleCheckVerificationCode = () => {
    navigation.navigate('PasswordReset');
  }

  const handleBack = () => {
    navigation.goBack();
  }

  // 시간 포맷팅 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.screen}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="비밀번호 재설정" backOnPress={handleBack}/>
      <View style={styles.pwcontainer}>
        {/* 이메일 입력 부분 */}
        <ShortInputComponent
          title="본인인증"
          placeholder="아이디(이메일) 입력"
          description="인증번호 전송"
          onChangeText={setEmail}
          value={email}
          onDuplicateCheck={handleSendVerificationCode}
          disabled={timer > 0} // 재전송 방지
        />

        {sendCodeError ? (
          <AlertComponent description={sendCodeError} />
        ) : sendCodeMessage ? (
          <AlertComponent description={sendCodeMessage} />
        ) : <View style={styles.space}/>}

        {/* 인증번호 입력 부분 (변경 부분) */}
        <ShortInputComponent
          placeholder="인증번호 입력"
          description="본인인증"
          onChangeText={setVerificationCode}
          value={verificationCode}
          onDuplicateCheck={handleCheckVerificationCode}
          rightContent={
            isCodeSent &&
            timer > 0 && (
              <Text style={{
                color: timer <= 60 ? "#FF0000" : "#666666",
                fontSize: 14,
                fontFamily: "NotoSans-Regular",
              }}>
                {formatTime(timer)}
              </Text>
            )
          }
        />

        {checkCodeError ? (
          <AlertComponent description={checkCodeError} />
        ) : checkCodeMessage ? (
          <AlertComponent description={checkCodeMessage} />
        ) : null}
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFFEFB",
    color: "#FFFEFB",
    flex: 1,
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
