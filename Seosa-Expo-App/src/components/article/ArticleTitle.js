/**
 * src/components/article/ArticleTitle.js
 */

import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TextInput } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ArticleTitle({ value, onChangeText }) {
  const [inputHeight, setInputHeight] = useState(height * 0.03 * 1.2);

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleWrapper}>
        <TextInput
          placeholder="아티클 제목 입력"
          value={value}
          onChangeText={onChangeText}
          style={[styles.titleText, { height: inputHeight }]}
          multiline
          onContentSizeChange={(e) =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#FFFEFB",
    marginTop: height * 0.05,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  titleWrapper: {
    width: width * 0.9,
    marginBottom: height * 0.0375,
  },
  titleText: {
    fontSize: height * 0.03,
    fontWeight: "500",
    fontFamily: "Noto Sans KR",
    margin: 0,
  },
});
