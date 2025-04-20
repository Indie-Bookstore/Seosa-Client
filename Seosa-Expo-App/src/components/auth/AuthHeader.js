import { Dimensions, StyleSheet, View, Text } from "react-native";
import BackButtonComponent from "../common/button/BackButtonComponent";

const AuthHeader = ({ title, backOnPress, theme = "white" }) => {
  const size = Dimensions.get("window").width * 0.067;

  const isGreen = theme === "green";
  const backgroundColor = isGreen ? "#487153" : "#FFFFFF";
  const textColor = isGreen ? "#FFFFFF" : "#000000";


  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          height: Dimensions.get("window").height * 0.07,
        }}
      >
        <View
          style={{
            marginTop: Dimensions.get("window").width * 0.05,
          }}
        >
          <BackButtonComponent
            width={size}
            height={size}
            onPress={backOnPress}
            theme={theme}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "flex-start", width: Dimensions.get("window").width * 0.9 }}>
        <Text
          style={{
            marginTop: Dimensions.get("window").height * 0.03125,
            marginBottom: Dimensions.get("window").height * 0.03125,
            height: Dimensions.get("window").height * 0.035,
            fontSize: Dimensions.get("window").height * 0.03,
            textAlign: "center",
            fontFamily: "UnBatangBold",
            color: textColor,
          }}
        >
          {title}
        </Text>
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
});
