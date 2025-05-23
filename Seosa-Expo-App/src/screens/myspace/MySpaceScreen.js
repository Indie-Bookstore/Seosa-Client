import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useRequireAuth } from '../../hooks/useRequireAuth';

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
  const isLoggedIn = useRequireAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <MySpaceHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <View style={styles.content}>
        {selectedTab === 'bookmark' ? (
          <MyBookmarkList />
        ) : (
          <MyCommentList />
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
