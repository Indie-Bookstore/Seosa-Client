// 회원가입 화면

import React from "react";
import { View, StyleSheet, Platform, Text, Dimensions } from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import RegisterComponent from "../../components/register/RegisterComponent";

// status bar 높이를 제외하고 싶은데 어떻게 해야 할지 아직 잘 모르겠음
const STATUSBAR_HEIGHT = Platform.OS === 'ios' 
  ? Constants.statusBarHeight 
  : StatusBar.currentHeight;

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
