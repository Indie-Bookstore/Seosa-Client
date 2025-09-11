// src/components/common/footer/Footer.js

import React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, Text, Platform, Alert } from 'react-native';
import { useRoute, CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../../utils/nav/RootNavigation'; 
import { useSelector } from 'react-redux';

import HomeNav from '../../../icons/home.svg';
import BookNav from '../../../icons/book.svg';
import UserNav from '../../../icons/user.svg';
import HomeSelNav from '../../../icons/home-selected.svg';
import BookSelNav from '../../../icons/book-selected.svg';
import UserSelNav from '../../../icons/user-selected.svg';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = width * 0.067;

const Footer = () => {
  const route = useRoute();
  const current = route.name;

  // 로그인 상태 판별
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 탭 정보
  const tabs = [
    { name: 'Home', label: '홈', Icon: HomeNav, SelectedIcon: HomeSelNav },
    { name: 'gallery', label: '글모음', Icon: BookNav, SelectedIcon: BookSelNav },
    { name: 'MySpace', label: '나의 공간', Icon: UserNav, SelectedIcon: UserSelNav },
  ];

  // 스택 초기화 후 이동
  const resetAndNavigate = (screenName) => {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screenName }],
      })
    );
  };

  // 보호된 탭 접근 처리
  const handleProtectedNavigate = (screenName) => {
    if (!accessToken) {
      if (Platform.OS === 'web') {
        const confirmed = window.confirm('로그인이 필요합니다. 로그인하시겠습니까?');
        if (confirmed) resetAndNavigate('Auth');
      } else {
        Alert.alert(
          '로그인 필요',
          '로그인이 필요합니다.',
          [
            { text: '취소', style: 'cancel' },
            { text: '로그인하기', onPress: () => resetAndNavigate('Auth') },
          ],
          { cancelable: true }
        );
      }
    } else {
      resetAndNavigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navcon}>
        {tabs.map((tab) => {
          const focused = current === tab.name;
          const TabIcon = focused ? tab.SelectedIcon : tab.Icon;
          const textStyle = focused ? [styles.des, styles.selectedText] : styles.des;

          // Home 탭은 바로 reset
          const onPressHandler = () => {
            if (tab.name === 'Home') {
              resetAndNavigate('Home');
            } else {
              handleProtectedNavigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.btnc}
              onPress={onPressHandler}
            >
              <TabIcon width={ICON_SIZE} height={ICON_SIZE} />
              <Text style={textStyle}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: height * 0.07,
    width: width,
    justifyContent: 'center',
    alignContent: 'center',
    borderTopColor: '#E1E1E1',
    borderTopWidth: height * 0.001875,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  navcon: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btnc: {
    width: width * 0.2,
    height: height * 0.0475,
    justifyContent: 'center',
    alignItems: 'center',
  },
  des: {
    color: '#888888',
    fontSize: height * 0.013,
    marginTop: height * 0.0025,
    marginBottom: height * 0.0025,
    fontFamily:"NotoSansRegular"
  },
  selectedText: {
    color: '#487153',
    fontSize: height * 0.013,
    marginTop: height * 0.0025,
    marginBottom: height * 0.0025,
    fontFamily:"NotoSansRegular"
  },
});

export default Footer;
