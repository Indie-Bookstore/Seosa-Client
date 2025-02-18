import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import ButtonComponent from "../common/ButtonComponent";
import InputComponent from "../common/InputComponent";
import AuthAlertComponent from "./AuthAlertComponent";

const AuthComponent = ({ onKakaoLoginPress, onLocalLoginPress }) => {
  return (
    <View style={styles.container}>
      <View style={{ height: Dimensions.get("window").height * 0.3025 }}>
        <View
          style={{ marginBottom: Dimensions.get("window").height * 0.0375 }}
        >
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
          />
        </View>
        <AuthAlertComponent
          description={"가입된 정보가 없습니다. 다시 입력해주세요."}
        />
        <View style={{ marginTop: Dimensions.get("window").height * 0.0125 }}>
          <InputComponent
            title="비밀번호"
            backgroundColor="transparent"
            placeholder="8자 이상의 비밀번호"
          />
        </View>
        <AuthAlertComponent
          description={"비밀번호가 일치하지 않습니다. 다시 입력해주세요."}
        />
      </View>

      <View style={{ marginTop: Dimensions.get("window").height * 0.04375 }}>
        <ButtonComponent
          onPress={onLocalLoginPress}
          description="로그인"
          btnType="btn-green"
        />
      </View>
      <View style={{ marginTop: Dimensions.get("window").height * 0.0125 }}>
        <ButtonComponent
          btnType="btn-greenbd"
          onPress={onKakaoLoginPress}
          description="이메일로 회원가입하기"
        />
      </View>
      <View>
        <TouchableOpacity
          style={{ marginTop: Dimensions.get("window").height * 0.025 }}
        >
          <Text
            style={{
              color: "#666666",
              fontSize: Dimensions.get("window").height * 0.01375,
            }}
          >
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
    height: Dimensions.get("window").height*0.5075,
    marginTop: Dimensions.get("window").height*0.02
  },
});

export default AuthComponent;
