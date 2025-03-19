// 비밀번호 input component

import React, { useState } from "react";
import { TextInput, Text, View, Dimensions, TouchableOpacity } from "react-native";
import OpenEyeIcon from "../../../icons/open-eye.svg";
import CloseEyeIcon from "../../../icons/close-eye.svg";

const PasswordInputComponent = ({
  backgroundColor,
  color,
  placeholder,
  value,
  onChangeText,
  title,
  required = false // 새로 추가된 필수 표시 prop
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      {title && (
        <Text
          style={{
            marginLeft: Dimensions.get("window").width * 0.0027,
            marginBottom: Dimensions.get("window").height * 0.005,
            color: "#666666",
            fontFamily: "NotoSans-Regular",
            fontWeight: "500"
          }}
        >
          {title}
          {required && <Text style={{color:"red"}}>*</Text>} {/* 필수 표시 조건부 렌더링 */}
        </Text>
      )}
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
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            color: color,
            fontSize: 16,
            fontFamily: "NotoSans-Regular",
            fontWeight: "400"
          }}
          placeholder={placeholder}
          placeholderTextColor={color}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          {showPassword ? (
            <OpenEyeIcon width={24} height={24} />
          ) : (
            <CloseEyeIcon width={24} height={24} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordInputComponent;
