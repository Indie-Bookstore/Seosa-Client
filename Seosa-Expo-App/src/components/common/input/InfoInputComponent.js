// 인증코드 입력 컴포넌트

import React, { useState } from "react";
import { View, Dimensions, TouchableOpacity, StyleSheet, TextInput, Text } from "react-native";
import InfoIcon from "./../../../icons/info.svg";
import BubbleComponent from "../info/BubbleComponent";

const InfoInputComponent = ({
  color,
  placeholder,
  value,
  onChangeText,
  title,
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const { width, height } = Dimensions.get("window");
  
  return (
    <View>
      {/* 상단 헤더 컨테이너 */}
      <View style={styles.headerContainer}>
        {/* 왼쪽 타이틀 영역 */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity 
            style={styles.iconWrapper}
            onPress={() => setShowBubble(!showBubble)}
          >
            <InfoIcon
              width={height * 0.02}
              height={height * 0.02}
              fill="#CCCCCC"
            />
          </TouchableOpacity>
        </View>

        {/* 오른쪽 버블 영역 */}
        <View style={styles.bubbleWrapper}>
          {showBubble && <BubbleComponent>
            인증코드는 에디터와 책방지기분들에 한해 발급됩니다. 
            발급을 원하시는 에디터/책방지기 분들은 카카오톡 채널(@카카오톡 채널)으로 연락주시기 바랍니다.</BubbleComponent>}
        </View>
      </View>

      {/* 입력 필드 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.inputField, { color }]}
          placeholder={placeholder}
          placeholderTextColor={color}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * 0.9,
    marginBottom: Dimensions.get("window").height * 0.005,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    height: Dimensions.get("window").height * 0.0225,
  },
  titleText: {
    color: "#666666",
    fontFamily: "NotoSans-Regular",
    fontWeight: "500",
    lineHeight: Dimensions.get("window").height * 0.0225,
    marginRight: 4,
  },
  iconWrapper: {
    justifyContent: "center",
    height: "100%",
  },
  bubbleWrapper: {
    width: Dimensions.get("window").width * 0.65,
    height: Dimensions.get("window").height * 0.0575, // 고정 높이 추가
  },
  inputContainer: {
    width: Dimensions.get("window").width * 0.9,
    aspectRatio: 7.71 / 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  inputField: {
    fontSize: 16,
    fontFamily: "NotoSans-Regular",
    fontWeight: "400",
    includeFontPadding: false,
  },
});

export default InfoInputComponent;
