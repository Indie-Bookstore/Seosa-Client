// 회원가입 화면

import React from "react";
import { View, StyleSheet} from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import Constants from 'expo-constants';
import RegisterComponent from "../../components/register/RegisterComponent";

const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const RegisterScreen = ({navigation}) => {

  const handleBack = () => {
    navigation.goBack();
  }

  const onLocalLoginPress = () => {
    navigation.navigate('Auth');
  }

  return (
    <View style={styles.container}>
      <View style={{height :STATUSBAR_HEIGHT }}/>
      <AuthHeader title="이메일로 회원가입하기" backOnPress={handleBack}/>
      <RegisterComponent onLocalLoginPress={onLocalLoginPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor :"#FFFEFB"
  }
});

export default RegisterScreen;
