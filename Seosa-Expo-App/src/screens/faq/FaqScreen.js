// FAQ 화면

import React from 'react';
import { View, StyleSheet, Platform, Text, Dimensions } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import Constants from 'expo-constants';
import FaqList from '../../components/admin/FaqList';

const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const FaqScreen = ({navigation}) => {

   const handleBack = () => {
      navigation.goBack();
   }
  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="FAQ/문의하기" backOnPress={handleBack} />
      <View style={styles.title}>
        <Text style={styles.titletext}>FAQ</Text>
      </View>
      <FaqList />
      <View style={styles.title}>
        <Text style={styles.titletext}>문의하기</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.description}>
          기타 문의사항은 카카오톡 채널{' '}
          <Text style={styles.highlight}>@채널이름</Text>으로 연락주시길 바랍니다.
        </Text>
      </View>
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#FFFEFB",
  },
  title: {
    width: width * 0.9,
    borderBottomColor: "#E1E1E1",
    borderBottomWidth: 2,
    height: height * 0.0425,
  },
  titletext: {
    fontSize: height * 0.02,
    color: "#666666",
    fontWeight: "400",
    paddingTop: height * 0.005,
    paddingLeft: height * 0.005,
  },
  box: {
    backgroundColor: "#E2E7E3",
    height: height * 0.065,
    width: width * 0.9,
    marginTop: height * 0.015,
    paddingLeft: height * 0.015,
    borderRadius: 8,
    justifyContent: "center",
    alignContent: "center",
  },
  description: {
    fontSize: height * 0.018,
    width: width * 0.8,
    color: "#666666",
  },
  highlight: {
   fontSize: height * 0.018,
   width: width * 0.8,
   color: "#7A9F85",
  },
});

export default FaqScreen;
