// src/screens/MainScreen.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Footer from '../../components/common/footer/Footer';

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <Text>메인 화면</Text>
      <Footer navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
});

export default MainScreen;
