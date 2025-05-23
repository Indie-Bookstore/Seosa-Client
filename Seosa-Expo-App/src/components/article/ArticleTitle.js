import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ArticleTitle = () => {
  // contentSizeChange 이벤트로 전달되는 높이를 저장
  const [inputHeight, setInputHeight] = useState(height * 0.03 * 1.2);

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleWrapper}>
        <TextInput
          placeholder="아티클 제목 입력"
          style={[styles.titleText, { height: inputHeight }]}
          multiline                    // 여러 줄 허용
          onContentSizeChange={(e) => {
            // 컨텐츠 높이가 변경될 때마다 업데이트
            setInputHeight(e.nativeEvent.contentSize.height);
          }}
          textAlignVertical="top"      // 안드로이드 상단 정렬
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#FFFEFB",
    marginTop: height * 0.05,
    alignItems: "center",
    borderBottomWidth :1,
    borderBottomColor:"#E1E1E1"
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

export default ArticleTitle;
