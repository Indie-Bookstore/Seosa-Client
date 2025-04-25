// 나의공간 화면

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Footer from '../../components/common/footer/Footer';
import MySpaceHeader from '../../components/myspace/MySpaceHeader';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

const MySpaceScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('bookmark'); // 기본은 북마크 탭

  return (
    <View style={styles.container}>
      {/* 상태바 높이 적용 */}
      <View style={{ height: STATUSBAR_HEIGHT }} />
      
      <MySpaceHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} navigation={navigation} />

      {/* 선택된 탭에 따라 렌더링할 콘텐츠 변경 */}
      <View style={styles.content}>
        {selectedTab === 'bookmark' ? <MyBookmarkList /> : <MyCommentList />}
      </View>

      {/* 푸터 */}
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor : "#FFFEFB"
  },
  content: {
    flex: 1,
    width: '100%', 
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default MySpaceScreen;
