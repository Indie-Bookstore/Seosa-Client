import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import LogoIcon from '../../icons/logo-yellow.svg';
import Footer from '../../components/common/footer/Footer';
import HomeInfo from '../../components/home/HomeInfo.js';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

const VerticalText = ({ children, style }) => (
  <Text style={style}>{children.split('').join('\n')}</Text>
);

const HomeScreen = ({ navigation }) => {
  const size = width * 0.13;

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      {/* 메인 콘텐츠 + HomeInfo */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}           // iOS bounce off
        overScrollMode="never"   // Android overscroll glow
      >
        {/* 메인 콘텐츠 */}
        <View style={styles.mainContent}>
          <View style={styles.leftSection}>
            <VerticalText style={styles.titleText}>서사</VerticalText>
            <LogoIcon width={size} height={size} />
          </View>
          <View style={styles.rightSection}>
            <VerticalText style={styles.subText}>책과 공간, 인연의 서사</VerticalText>
          </View>
        </View>

        {/* HomeInfo (하단 정보) */}
        <HomeInfo navigation={navigation} />
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEA' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: height * 0.07 },
  mainContent: {
    flex: 1,
    backgroundColor: '#487153',
    minHeight: height * 0.85,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  titleText: {
    fontSize: height * 0.05,
    color: '#FFFBEA',
    fontFamily: 'NotoSans-Medium',
    lineHeight: height * 0.06,
    textAlign: 'center',
    marginTop: height * 0.25,
    marginBottom: 20,
  },
  subText: {
    fontSize: height * 0.02,
    color: '#FFFBEA',
    fontFamily: 'NotoSans-Medium',
    lineHeight: height * 0.025,
    marginTop: height * 0.30,
    textAlign: 'center',
  },
  leftSection: { alignItems: 'center', marginRight: 20 },
  rightSection: { alignItems: 'center', marginLeft: 20 },
});

export default HomeScreen;
