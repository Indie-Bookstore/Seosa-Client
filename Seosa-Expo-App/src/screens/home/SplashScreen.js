// splash 화면

import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import LogoIcon from "../../icons/logo-green.svg";
import SafeTopSpacer from "../../components/common/layout/SafeTopSpacer";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const size = Dimensions.get("window").width * 0.13;

  return (
    <View style={styles.container}>
      <SafeTopSpacer />
      <View style={styles.content}>
        <LogoIcon width={size} height={size} />
        <Text style={styles.title}>책과 공간, 인연의 서사</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFBEA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: height * 0.02,
    color: "#487153",
    marginTop: height * 0.02,
    fontFamily:"Unbatang-Bold"
  },
});

export default SplashScreen;
