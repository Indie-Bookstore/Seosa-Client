import React from "react";
import { Text, TouchableOpacity, Dimensions, View } from "react-native";
import KakaoLogo from "../../icons/kakao-logo.svg";

const ButtonComponent = ({ btnType, description, onPress }) => {
  const getButtonStyle = (type) => {
    switch (type) {
      case "btn-gray":
        return { backgroundColor: "#E1E1E1", color: "#888888", border: null };
      case "btn-kakao":
        return { backgroundColor: "#FEE500", color: "#000000", border: null };
      case "btn-green":
        return { backgroundColor: "#487153", color: "#FFFFFF", border: null };
      case "btn-greenbd":
        return {
          backgroundColor: "#FFFFFF",
          color: "#487153",
          border: { color: "#487153", width: 1 },
        };
      default:
        return { backgroundColor: "#E1E1E1", color: "#888888", border: null };
    }
  };

  const { backgroundColor, color, border } = getButtonStyle(btnType);

  return (
    <TouchableOpacity
      style={{
        width: Dimensions.get("window").width * 0.9,
        aspectRatio: 7.36 / 1,
        backgroundColor: backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 22,
        ...(border && {
          borderStyle: "solid",
          borderColor: border.color,
          borderWidth: border.width,
        }),
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {btnType === "btn-kakao" && <KakaoLogo />}
        <Text
          style={{
            color: color,
            fontSize: Dimensions.get("window").height * 0.0175,
            width: Dimensions.get("window").width * 0.72,
            textAlign:'center',
            fontFamily:"NotoSans-Medium",
            fontWeight:"600"
          }}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
