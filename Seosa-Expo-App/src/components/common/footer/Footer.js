import React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, Text, Platform, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { navigate } from '../../../utils/nav/RootNavigation'; 
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

  // Redux에서 accessToken 여부를 가져와서 로그인 상태 판별
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 탭 정보 배열
  const tabs = [
    { name: 'Home', label: '홈', Icon: HomeNav, SelectedIcon: HomeSelNav },
    { name: 'gallery', label: '글모음', Icon: BookNav, SelectedIcon: BookSelNav },
    { name: 'MySpace', label: '나의 공간', Icon: UserNav, SelectedIcon: UserSelNav },
  ];

  // Protected 탭(글모음, 나의 공간 등)에 접근할 때 호출되는 함수
  const handleProtectedNavigate = (screenName) => {
    if (!accessToken) {
      // 웹일 경우 window.confirm, 모바일일 경우 Alert 사용
      if (Platform.OS === 'web') {
        const confirmed = window.confirm('로그인이 필요합니다. 로그인하시겠습니까?');
        if (confirmed) {
          navigate('Auth');
        }
      } else {
        Alert.alert(
          '로그인 필요',
          '로그인이 필요합니다.',
          [
            { text: '취소', style: 'cancel' },
            { text: '로그인하기', onPress: () => navigate('Auth') },
          ],
          { cancelable: true }
        );
      }
    } else {
      // 로그인 상태면 해당 스크린으로 이동
      navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navcon}>
        {tabs.map((tab) => {
          const focused = current === tab.name;
          const TabIcon = focused ? tab.SelectedIcon : tab.Icon;
          const textStyle = focused ? [styles.des, styles.selectedText] : styles.des;

          // 탭이 Home이면 무조건 이동, 아니면 로그인 체크
          const onPressHandler = () => {
            if (tab.name === 'Home') {
              navigate('Home');
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
  },
  selectedText: {
    color: '#487153',
  },
});

export default Footer;