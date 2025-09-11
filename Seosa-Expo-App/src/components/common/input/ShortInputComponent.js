// src/components/common/input/ShortInputComponent.js
// 짧은 인풋 컴포넌트 (rightContent 위치 개선)

import React from "react";
import { TextInput, Text, View, Dimensions } from "react-native";
import ShortButtonComponent from "../button/ShortButtonComponent";

const W = Dimensions.get("window").width;
const H = Dimensions.get("window").height;

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
  rightContent = null,
}) => {
  return (
    <View>
      {/* 제목 라벨 */}
      {title && (
        <Text
          style={{
            marginLeft: W * 0.0027,
            marginBottom: H * 0.005,
            color: "#666666",
            fontFamily: "NotoSans-Regular",
          }}
        >
          {title}
          {required && (
            <Text style={{ color: "red", fontFamily: "NotoSans-Regular" }}>
              *
            </Text>
          )}
        </Text>
      )}

      {/* 인풋 + 버튼 */}
      <View
        style={{
          flexDirection: "row",
          width: W * 0.9,
          justifyContent: "space-between",
        }}
      >
        {/* 인풋 박스 */}
        <View
          style={{
            width: W * 0.638,
            height: W * 0.1167,
            backgroundColor,
            justifyContent: "center",
            borderRadius: 11,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#CCCCCC",
            position: "relative",
          }}
        >
          <TextInput
            style={{
              width: W * 0.568,
              height:W*0.9*0.13,
              color,
              fontSize: 16,
              fontFamily: "NotoSans-Regular",
              paddingRight: 60, // 오른쪽 콘텐츠 영역 확보
            }}
            placeholder={placeholder}
            placeholderTextColor={color}
            value={value}
            onChangeText={onChangeText}
          />

          {/* rightContent : 타이머·아이콘 등 */}
          {rightContent && (
            <View
              style={{
                position: "absolute",
                right: 15,
                top: 0,
                bottom: 0,
                justifyContent: "center", // 수직 중앙 정렬
                alignItems: "center",
              }}
            >
              {rightContent}
            </View>
          )}
        </View>

        {/* 중복확인 / 보내기 버튼 */}
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
