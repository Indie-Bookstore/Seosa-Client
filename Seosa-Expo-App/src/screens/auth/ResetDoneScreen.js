// 비밀번호 리셋 완료 화면

import { View, StyleSheet, Dimensions, Text } from "react-native";
import AuthHeader from "../../components/auth/AuthHeader";
import Constants from "expo-constants";
import ButtonComponent from "../../components/common/button/ButtonComponent";
import { CommonActions } from '@react-navigation/native';


const STATUSBAR_HEIGHT = Constants.statusBarHeight;

const ResetDoneScreen = ({ navigation }) => {

   const handleLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
   }

   const getCurrentDate = () => {
      const date = new Date();
      return `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일`;
    };
  

  return (
    <View style={styles.screen}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="비밀번호 재설정" />
      
      <View style={styles.textcontainer}>
        <Text style={styles.title}>
            회원님의 비밀번호가
        </Text>
        <Text style={styles.title}>
            변경되었습니다.
        </Text>
        <Text style={styles.description}>변경일 : {getCurrentDate()}</Text>
      </View>
      <View style={styles.buttonContainer}>
          <ButtonComponent
            btnType="btn-green"
            onPress={handleLogin}
            description="로그인"
          />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFFEFB",
    flex: 1,
    alignItems: "center",
  },
  textcontainer: {
    marginTop: height * 0.2,
    width: width * 1,
    justifyContent:"center",
    alignItems:"center"
  },
  title:{
   textAlign: "center",
   alignContent:"center",
   fontSize:height*0.02125,
   fontFamily:"NotoSans-Regular"
  },
  description: {
   textAlign: "center",
   alignContent:"center",
   fontSize:height*0.015,
   marginTop:height*0.05875,
   color:"#487153",
   fontFamily:"NotoSans-Regular"
  },
  spacer: {
    height: height * 0.01,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.05,
    width: "90%",
    alignContent: "center",
    justifyContent: "center",
  },
});

export default ResetDoneScreen;
