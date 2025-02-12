import React from "react";
import { View, StyleSheet, Platform, Text, Dimensions } from "react-native";
import AuthComponent from "../../components/auth/AuthComponent";
import AuthHeader from "../../components/auth/AuthHeader";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

// status bar 높이를 제외하고 싶은데 어떻게 해야 할지 아직 잘 모르겠음
const STATUSBAR_HEIGHT = Platform.OS === 'ios' 
  ? Constants.statusBarHeight 
  : StatusBar.currentHeight;

const AuthScreen = ({ onKakaoLoginPress, onLocalLoginPress }) => {
  return (
    <View style={styles.container}>
      <View style={{height :STATUSBAR_HEIGHT }}/>
      <AuthHeader title="로그인/회원가입"/>
      <AuthComponent onKakaoLoginPress={onKakaoLoginPress} onLocalLoginPress={onLocalLoginPress}/>
      <View style={styles.channel}>
        <Text style={{color:"#666666", fontSize:Dimensions.get('window').height*0.0125}}>책방지기분들은 카카오톡채널로 연락주세요!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  channel: {
    marginBottom : Dimensions.get('window').height*0.0925,
    height: Dimensions.get('window').height*0.01875
  }
});

export default AuthScreen;
