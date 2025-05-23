import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import Footer from '../../components/common/footer/Footer';
import AdminMySpaceHeader from '../../components/admin/AdminMySpaceHeader';
import AdminPostList from '../../components/admin/AdminPostList';
import MyBookmarkList from '../../components/myspace/MyBookmarkList';
import MyCommentList from '../../components/myspace/MyCommentList';

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight;

const AdminMySpaceScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('write');
  const user = useSelector((state) => state.auth.user);

  useFocusEffect(
    useCallback(() => {
      if (!user || user.userRole !== 'ADMIN') {
        Alert.alert('접근 제한', '관리자만 접근 가능한 화면입니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      }
    }, [user, navigation])
  );

  if (!user || user.userRole !== 'ADMIN') return null;

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
      <Footer navigation={navigation} />
    </View>
  );
};

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

export default AdminMySpaceScreen;
