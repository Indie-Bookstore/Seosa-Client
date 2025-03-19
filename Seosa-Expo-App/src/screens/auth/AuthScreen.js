// src/screens/auth/AuthScreen.js
import React from 'react';
import { View, StyleSheet, Platform, Text, Dimensions } from 'react-native';
import AuthComponent from '../../components/auth/AuthComponent';
import AuthHeader from '../../components/auth/AuthHeader';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';

const STATUSBAR_HEIGHT = Platform.OS === 'ios'
  ? Constants.statusBarHeight
  : StatusBar.currentHeight;

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // 기존 토큰 파싱 로직 대신 KakaoLogin 화면으로 이동
  const handleKakaoLoginPress = () => {
    navigation.navigate('KakaoLogin');
  };

  const handleLocalRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="로그인/회원가입" />
      <AuthComponent 
        onKakaoLoginPress={handleKakaoLoginPress} 
        onLocalRegisterPress={handleLocalRegisterPress}
        navigation={navigation}
      />
      <View style={styles.channel}>
        <Text style={{
          color: "#666666",
          fontSize: Dimensions.get('window').height * 0.0125,
          fontFamily: "NotoSans-Regular",
          fontWeight: "500"
        }}>
          책방지기분들은 카카오톡채널로 연락주세요!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFEFB"
  },
  channel: {
    marginBottom: Dimensions.get('window').height * 0.0925,
    height: Dimensions.get('window').height * 0.01875
  }
});

export default AuthScreen;
