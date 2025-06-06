// src/screens/admin/AdminMySpaceScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import Constants from 'expo-constants';
import { navigate } from '../../utils/nav/RootNavigation'; // ← navigate 임포트 추가

import Footer from '../../components/common/footer/Footer';
import AdminMySpaceHeader from '../../components/admin/AdminMySpaceHeader';
import AdminPostList from '../../components/admin/AdminPostList';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios'
    ? Constants.statusBarHeight
    : RNStatusBar.currentHeight || 0;

export default function AdminMySpaceScreen() {
  const [selectedTab, setSelectedTab] = useState('write');

  return (
    <View style={styles.container}>
      {/* 상태바 만큼 빈 뷰 */}
      <View style={{ height: STATUSBAR_HEIGHT }} />

      {/* 관리자 전용 헤더 */}
      <AdminMySpaceHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* 컨텐츠 영역 */}
      <View style={styles.content}>
        {selectedTab === 'write' && (
          <AdminPostList onItemPress={(postId) => navigate('Post', {postId})}/>)}
        {selectedTab === 'bookmark' && (
          <MyBookmarkList
            onItemPress={(postId) => navigate('Post', { postId })}
          />
        )}
        {selectedTab === 'comment' && (
          <MyCommentList
            onItemPress={(postId) => navigate('Post', { postId })}
          />
        )}
      </View>

      {/* Footer */}
      <Footer />
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
