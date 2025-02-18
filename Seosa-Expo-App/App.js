import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

import AuthScreen from "./src/screens/auth/AuthScreen";
import KakaoLogin from "./src/components/auth/KakaoLogin";
import CodeDisplayScreen from "./src/screens/CodeDisplayScreen";

export default function App() {

  const [authCode, setAuthCode] = useState(null);
  const [showKakaoLogin, setShowKakaoLogin] = useState(false);

  const handleCodeReceived = (code) => {
    setAuthCode(code);
    setShowKakaoLogin(false);
  };

  const handleKakaoLoginPress = () => {
    setShowKakaoLogin(true);
  };

  const handleLogout = () => {
    setAuthCode(null);
  };

  return (
    <View style={styles.container}>
      {authCode ? (
        <CodeDisplayScreen code={authCode} onLogout={handleLogout} />
      ) : showKakaoLogin ? (
        <KakaoLogin onCodeReceived={handleCodeReceived} />
      ) : (
        <AuthScreen onKakaoLoginPress={handleKakaoLoginPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
