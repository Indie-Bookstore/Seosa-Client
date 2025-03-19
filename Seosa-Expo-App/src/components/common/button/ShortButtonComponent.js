// 짧은 버튼 색상별

import React from "react";
import { Text, TouchableOpacity, Dimensions, View } from "react-native";
import KakaoLogo from "../../../icons/kakao-logo.svg";

const ShortButtonComponent = ({ 
  btnType, 
  description, 
  onPress, 
  disabled = false 
}) => {
  const getButtonStyle = (type) => {
    if (disabled) return { bg: "#E1E1E1", text: "#888888" };
    
    switch (type) {
      case "btn-gray": return { bg: "#E1E1E1", text: "#888888" };
      case "btn-kakao": return { bg: "#FEE500", text: "#000000" };
      case "btn-green": return { bg: "#487153", text: "#FFFFFF" };
      case "btn-greenbd": return { bg: "#FFFFFF", text: "#487153" };
      default: return { bg: "#E1E1E1", text: "#888888" };
    }
  };

  const { bg, text } = getButtonStyle(btnType);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      style={{
        width: Dimensions.get("window").width * 0.238,
        height: Dimensions.get("window").width * 0.1167,
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        opacity: disabled ? 0.6 : 1, 
        ...(btnType === "btn-greenbd" && {
          borderWidth: 1,
          borderColor: "#487153"
        })
      }}
      accessibilityRole="button"
      pointerEvents={disabled ? "none" : "auto"}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {btnType === "btn-kakao" && <KakaoLogo />}
        <Text
          style={{
            color: text,
            fontSize: Dimensions.get("window").height * 0.0175,
            width: Dimensions.get("window").width * 0.15,
            textAlign: 'center',
            fontFamily: "NotoSans-Medium",
            fontWeight: "600",
            opacity: disabled ? 0.6 : 1
          }}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShortButtonComponent;
