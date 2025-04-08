// 작은 버튼 색상별

import React from "react";
import { Text, TouchableOpacity, Dimensions, View } from "react-native";

const SmallButtonComponent = ({ 
  btnType, 
  description, 
  onPress, 
  disabled = false 
}) => {
  const getButtonStyle = (type) => {
    if (disabled) return { bg: "#E1E1E1", text: "#888888" };
    
    switch (type) {
      case "btn-yellow": return { bg: "#FFEEAA", text: "#487153" };
      case "btn-red": return { bg: "#FF7253", text: "#FFFEFB" };
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
        width: Dimensions.get("window").width * 0.12,
        height: Dimensions.get("window").width * 0.07,
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        opacity: disabled ? 0.6 : 1, 
      }}
      accessibilityRole="button"
      pointerEvents={disabled ? "none" : "auto"}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {btnType === "btn-kakao" && <KakaoLogo />}
        <Text
          style={{
            color: text,
            fontSize: Dimensions.get("window").height * 0.016,
            width: Dimensions.get("window").width * 0.1,
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

export default SmallButtonComponent;
