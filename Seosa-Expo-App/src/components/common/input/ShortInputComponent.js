// 짧은 인풋 컴포넌트
// right content를 넣어서 인증코드 유효시간 타이머 부분 추가
import React from "react";
import { TextInput, Text, View, Dimensions } from "react-native";
import ShortButtonComponent from "../button/ShortButtonComponent";

const ShortInputComponent = ({
  backgroundColor,
  color,
  placeholder,
  value,
  onChangeText,
  title,
  onDuplicateCheck,
  description,
  duplicateBtnType = "btn-gray",
  required = false,
  disabled = false,
  rightContent = null
}) => {
  return (
    <View>
      {title && (
        <Text
          style={{
            marginLeft: Dimensions.get("window").width * 0.0027,
            marginBottom: Dimensions.get("window").height * 0.005,
            color: "#666666",
            fontFamily: "NotoSans-Regular",
          }}
        >
          {title}
          {required && <Text style={{ color: "red", fontFamily: "NotoSans-Regular" }}>*</Text>}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          width: Dimensions.get("window").width * 0.9,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: Dimensions.get("window").width * 0.638,
            height: Dimensions.get("window").width * 0.1167,
            backgroundColor: backgroundColor,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 11,
            padding: 10,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#CCCCCC",
            position: "relative", // 추가된 스타일
          }}
        >
          <TextInput
            style={{
              width: Dimensions.get("window").width * 0.568,
              aspectRatio: 10 / 1,
              color: color,
              fontSize: 16,
              fontFamily: "NotoSans-Regular",
              paddingRight: 60,
            }}
            placeholder={placeholder}
            placeholderTextColor={color}
            value={value}
            onChangeText={onChangeText}
          />
          {/* 조건부 렌더링 */}
          {rightContent && (
            <View
              style={{
                position: "absolute",
                right: 15,
                top: "50%",
                transform: [{ translateY: -10 }],
              }}
            >
              {rightContent}
            </View>
          )}
        </View>
        <ShortButtonComponent
          description={description}
          btnType={duplicateBtnType}
          onPress={onDuplicateCheck}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

export default ShortInputComponent;
