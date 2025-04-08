import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import Footer from '../../components/common/footer/Footer';
import AdminMySpaceHeader from '../../components/admin/AdminMySpaceHeader';
import AdminPostList from '../../components/admin/AdminPostList';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

const AdminMySpaceScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("write"); // 기본값: 글쓰기

  return (
    <View style={styles.container}>
      {/* 상태바 높이 적용 */}
      <View style={{ height: STATUSBAR_HEIGHT }} />
      
      {/* 헤더 */}
      <AdminMySpaceHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* 선택된 콘텐츠 렌더링 */}
      <View style={styles.content}>
        {selectedTab === "write" && <AdminPostList />}
        {selectedTab === "bookmark" && <MyBookmarkList />}
        {selectedTab === "comment" && <MyCommentList />}
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
    flex: 1, // 푸터를 바닥에 붙이기 위해 중간 콘텐츠 공간 확보
    width: '100%',
  },
});

export default AdminMySpaceScreen;
