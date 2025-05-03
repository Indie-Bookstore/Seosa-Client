import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const HomeInfo = ({ navigation }) => {

  const handlePolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleTermofUse = () => {
    navigation.navigate('TermsofUse')
  };

  return (
    <View style={styles.container}>
      <View style={styles.textcon}>
        <TouchableOpacity onPress={handleTermofUse}>
          <Text style={styles.text}>이용약관</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePolicy}>
          <Text style={styles.text}>개인정보처리방침</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.text}>카카오톡 문의</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>ⓒ 2025. 서사. ALL Rights Reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E1E1E1",
    width: width,
    height: height * 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  textcon: {
    flexDirection: "row",
    width: width * 0.9,
    gap: width * 0.05,
  },
  text: {
    fontSize: height * 0.0125,
    color: "#888888",
    marginVertical: 4,
  },
  copyright: {
    fontSize: height * 0.0125,
    color: "#888888",
    marginTop: height * 0.01,
    width: width * 0.9,
  },
});

export default HomeInfo;
