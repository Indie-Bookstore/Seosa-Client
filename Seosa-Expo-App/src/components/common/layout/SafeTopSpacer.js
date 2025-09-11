import React from "react";
import { View, Platform, StatusBar as RNStatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeTopSpacer() {
  const insets = useSafeAreaInsets();
  const top = Platform.OS === "ios" ? insets.top : RNStatusBar.currentHeight ?? 0;
  return <View style={{ height: top }} />;
}
