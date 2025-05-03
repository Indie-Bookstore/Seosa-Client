import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import Footer from '../../components/common/footer/Footer';
import MySpaceHeader from '../../components/myspace/MySpaceHeader';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight;

const MySpaceScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('bookmark');

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <MySpaceHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} navigation={navigation} />
      <View style={styles.content}>
        {selectedTab === 'bookmark' ? <MyBookmarkList /> : <MyCommentList />}
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FFFEFB' },
  content: { flex: 1, width: '100%' },
});

export default MySpaceScreen;
