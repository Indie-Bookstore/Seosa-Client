// 헤더 컴포넌트 (AuthHeader지만 다른 화면에서 사용되기도 함 나중에 통합 리팩토링 예정)

import { Dimensions, StyleSheet, View, Text } from "react-native";
import BackButtonComponent from "../common/button/BackButtonComponent";

const AuthHeader = ({ title, backOnPress, theme = "white", color }) => {
  const size = Dimensions.get("window").width * 0.067;

  const isGreen = theme === "green";
  const backgroundColor = isGreen ? "#487153" : "#FFFFFF";
  const textColor = isGreen ? "#FFFFFF" : "#000000";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.margin}>
          <BackButtonComponent
            width={size}
            height={size}
            onPress={backOnPress}
            theme={theme}
          />
        </View>
      </View>

      <View style={styles.titlebox}>
        <Text style={[styles.titletext, color=textColor]}>{title}</Text>
      </View>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1675,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.07,
  },
  margin: {
    marginTop: Dimensions.get("window").width * 0.05,
  },
  titlebox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: Dimensions.get("window").width * 0.9,
  },
  titletext: {
    marginTop: Dimensions.get("window").height * 0.03125,
    marginBottom: Dimensions.get("window").height * 0.03125,
    height: Dimensions.get("window").height * 0.035,
    fontSize: Dimensions.get("window").height * 0.03,
    textAlign: "center",
    fontFamily: "UnBatang-Bold",
  },
});
