import React from "react";
import { View, Platform, StyleSheet, Dimensions } from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import AuthAlertComponent from "../../components/auth/AuthAlertComponent";

const STATUSBAR_HEIGHT = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : StatusBar.currentHeight;

const PasswordResetScreen = () => {


  return (
    <View style={styles.screen}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="비밀번호 재설정"/>
      <View style={styles.pwcontainer}>
         <ShortInputComponent title="본인인증" placeholder="아이디(이메일) 입력" description="인증번호 전송"/>
         <AuthAlertComponent />
         <ShortInputComponent placeholder="인증번호 입력" description="본인인증"/>
         <AuthAlertComponent />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
   screen : {
      backgroundColor : 'white',
      flex:1,
      alignItems : 'center'
   },
   pwcontainer: {
      marginTop: height*0.02,
      height: height*0.16,
      width: width*0.9
   }
});

export default PasswordResetScreen;
