// src/screens/auth/RegisterScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import Constants      from "expo-constants";
import AuthHeader     from "../../components/auth/AuthHeader";
import RegisterComponent from "../../components/register/RegisterComponent";

const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function RegisterScreen({ navigation }) {
  /* ──── 키보드 표시 여부 ──── */
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardShown(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardShown(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ──── 핸들러 ──── */
  const handleBack        = () => navigation.goBack();
  const onLocalLoginPress = () => navigation.navigate("Auth");

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        /* 키보드 보여질 때만 중앙 정렬을 OFF → 자연스러운 오버 스크롤 */
        contentContainerStyle={
          keyboardShown ? styles.containerActive : styles.containerCenter
        }
      >
        {/* 상태바 높이만큼 여백 */}
        <View style={{ height: STATUSBAR_HEIGHT }} />

        <AuthHeader title="이메일로 회원가입하기" backOnPress={handleBack} />

        <RegisterComponent onLocalLoginPress={onLocalLoginPress} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ──── RegisterScreen 전용 스타일 (기존 스타일은 변경 X) ──── */
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#FFFEFB",
  },
  /* 키보드가 없을 때: 기존 레이아웃 그대로(가운데 정렬) */
  containerCenter: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFEFB",
  },
  /* 키보드 있을 때: justifyContent 제거 → 위에서부터 레이아웃 */
  containerActive: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#FFFEFB",
  },
});
