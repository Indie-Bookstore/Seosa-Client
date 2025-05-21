// src/screens/myspace/MySpaceScreen.js

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import MySpaceHeader from '../../components/myspace/MySpaceHeader';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';
import Footer from '../../components/common/footer/Footer';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios'
    ? Constants.statusBarHeight
    : StatusBar.currentHeight;

export default function MySpaceScreen() {
  const [selectedTab, setSelectedTab] = useState('bookmark');
  const navigation = useNavigation();
  // accessToken 기반으로 로그인 여부 판단
  const isLoggedIn = useSelector(state => !!state.auth.accessToken);

  // 화면이 포커스될 때마다 로그인 체크
  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        if (Platform.OS === 'web') {
          const ok = window.confirm('로그인이 필요합니다. 로그인하시겠습니까?');
          if (ok) {
            navigation.navigate('Auth');
          } else {
            navigation.goBack();
          }
        } else {
          Alert.alert(
            '로그인 필요',
            '이 기능을 이용하려면 로그인이 필요합니다.',
            [
              { text: '취소', style: 'cancel', onPress: () => navigation.goBack() },
              { text: '로그인하기', onPress: () => navigation.navigate('Auth') },
            ],
            { cancelable: false }
          );
        }
      }
    }, [isLoggedIn, navigation])
  );

  // 로그인 전에는 빈 화면을 렌더하지 않음
  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* 상태바 높이 확보 */}
      <View style={{ height: STATUSBAR_HEIGHT }} />

      {/* 헤더 */}
      <MySpaceHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        navigation={navigation}
      />

      {/* 콘텐츠 */}
      <View style={styles.content}>
        {selectedTab === 'bookmark' ? (
          <MyBookmarkList />
        ) : (
          <MyCommentList />
        )}
      </View>

      {/* 푸터 */}
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEFB',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});
