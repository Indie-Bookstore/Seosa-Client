// src/screens/myspace/MySpaceScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
import { navigate } from '../../utils/nav/RootNavigation';

import MySpaceHeader from '../../components/myspace/MySpaceHeader';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';
import Footer from '../../components/common/footer/Footer';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios'
    ? Constants.statusBarHeight
    : Constants.statusBarHeight;

export default function MySpaceScreen() {
  const [selectedTab, setSelectedTab] = useState('bookmark');
  const user = useSelector(state => state.auth.user);
  const profileImage = user?.profileImage || null;

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <MySpaceHeader
        selectedTab={selectedTab}
        setSelectedTab={tab => setSelectedTab(tab)}
        profileImage={profileImage}
      />
      <View style={styles.content}>
        {selectedTab === 'bookmark' ? (
          <MyBookmarkList onItemPress={postId => navigate('PostDetail', { postId })} />
        ) : (
          <MyCommentList onItemPress={commentId => navigate('CommentDetail', { commentId })} />
        )}
      </View>
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
