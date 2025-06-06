// src/screens/admin/AdminMySpaceScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

import Footer from '../../components/common/footer/Footer';
import AdminMySpaceHeader from '../../components/admin/AdminMySpaceHeader';
import AdminPostList from '../../components/admin/AdminPostList';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight;

export default function AdminMySpaceScreen() {
  const [selectedTab, setSelectedTab] = useState('write');

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AdminMySpaceHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <View style={styles.content}>
        {selectedTab === 'write' && <AdminPostList />}
        {selectedTab === 'bookmark' && <MyBookmarkList />}
        {selectedTab === 'comment' && <MyCommentList />}
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFEFB',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});
