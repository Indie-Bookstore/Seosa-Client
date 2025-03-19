// 일반 input 컴포넌트트

import React from "react";
import { TextInput, Text, View, Dimensions } from "react-native";

const InputComponent = ({
  backgroundColor,
  color,
  placeholder,
  value,
  onChangeText,
  title,
}) => {
  return (
    <View>
      <Text
        style={{
          marginLeft: Dimensions.get("window").width * 0.0027,
          marginBottom: Dimensions.get("window").height * 0.005,
          color: "#666666",
          fontFamily: "NotoSans-Regular",
          fontWeight: "500",
        }}
      >
        {title}
      </Text>
      <View
        style={{
          width: Dimensions.get("window").width * 0.9,
          aspectRatio: 7.71 / 1,
          backgroundColor: backgroundColor,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 11,
          padding: 10,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#CCCCCC",
        }}
      >
        <TextInput
          style={{
            width: Dimensions.get("window").width * 0.83,
            aspectRatio: 20 / 1,
            color: color,
            fontSize: 16,
            fontFamily: "NotoSans-Regular",
            fontWeight: "400",
          }}
          placeholder={placeholder}
          placeholderTextColor={color}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default InputComponent;
