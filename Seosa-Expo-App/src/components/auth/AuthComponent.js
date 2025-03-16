import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useDispatch } from 'react-redux';
import ButtonComponent from "../common/button/ButtonComponent.js";
import InputComponent from "../common/input/InputComponent.js";
import AuthAlertComponent from "./AuthAlertComponent";
import PasswordInputComponent from "../common/input/PasswordInputComponent.js";
import api from "../../api/axios.js";
import { setAccessToken, setUser } from '../../store/authSlice';
import { setRefreshToken } from '../../utils/tokenStorage';

const AuthComponent = ({ onKakaoLoginPress, onLocalRegisterPress, navigation }) => {
  
  /* 이메일, 비밀번호, 로그인 대기(필요하지 않을 시 제거), 로그인 에러, 비밀번호 에러 state 관리 */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // redux action dispatch
  const dispatch = useDispatch();

  // email 값이 존재하고 password 길이가 8 이상일 경우만 
  const isLoginEnabled = email.trim() !== "" && password.length >= 8;
  
  // 로그인 함수
  const onLocalLoginPress = async () => {
    if (!isLoginEnabled || isLoading) return;
  
    setIsLoading(true);
    setLoginError("");
  
    const request = {
      user_email: email,
      password: password,
    };
  
    console.log("🔹 Login Request:", request); // 요청 데이터 확인
  
    try {
      const response = await api.post('/login', request);
  
      const { accessToken, refreshToken, user } = response.data;
  
      await setRefreshToken(refreshToken);
      dispatch(setAccessToken(accessToken));
      dispatch(setUser(user));
      
      /******************** Home 화면이 현재는 없기 때문에 추후 수정 필수 ********************/

      navigation.navigate('Home');
      
    } catch (error) {

      console.error('🚨 Login error:', error);
      
      /* 에러가 서버 에러인지, 아이디 에러인지, 비밀번호 에러인지 
      error type 뭐뭐 있는지에 따라 구분 및 에러메세지 설정 필수 */

      if (error.response) {
        setLoginError(error.response.data.message || "잘못된 요청입니다.");
      } else if (error.request) {
        setLoginError("서버에 연결할 수 없습니다. 네트워크 설정을 확인하거나 잠시 후 다시 시도해주세요.");
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
            backgroundColor="transparent"
            placeholder="abc@email.com"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        {loginError && (
          <AuthAlertComponent description={loginError} />
        )}
        <View style={styles.passwordInputContainer}>
          <PasswordInputComponent
            title="비밀번호"
            backgroundColor="transparent"
            placeholder="8자 이상의 비밀번호"
            onChangeText={setPassword}
            value={password}
            type={password}
            secureTextEntry
          />
        </View>
        {passwordError && (
          <AuthAlertComponent description={passwordError} />
        )}
      </View>

      <View style={styles.loginButtonContainer}>
        <ButtonComponent
          onPress={onLocalLoginPress}
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
      <View>
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>
            계정 찾기/비밀번호 재설정
          </Text>
        </TouchableOpacity>
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
    fontSize: Dimensions.get("window").height * 0.0125,
    fontFamily: "NotoSans-Regular",
    fontWeight: "400",
  },
});

export default AuthComponent;
