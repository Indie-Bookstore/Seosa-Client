// src/screens/post/PostScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import api from '../../api/axios.js';

import PostHeader  from '../../components/post/PostHeader';
import PostTitle   from '../../components/post/PostTitle';
import PostContent from '../../components/post/PostContent';
import PostInfo    from '../../components/post/PostInfo';
import PostItem    from '../../components/post/PostItem';
import PostEditor  from '../../components/post/PostEditor';
import PostComment from '../../components/post/PostComment';

export default function PostScreen({ navigation, route }) {
  const STATUSBAR_HEIGHT = Platform.OS === 'ios'
    ? Constants.statusBarHeight
    : StatusBar.currentHeight;

  const { postId } = route.params;
  const [postData, setPostData] = useState(null);
  const [loading, setLoading]   = useState(true);

  /* “뒤로가기” 핸들러 */
  const handleBack = () => {
    navigation.goBack();
  };

  /* GET /post/{postId} */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/post/${postId}`);
        setPostData(res.data);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        Alert.alert('오류', '게시글을 불러오지 못했습니다.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading || !postData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#487153" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <PostHeader
        title="나의 공간"
        onBackPress={handleBack}
        onDotPress={() => console.log('Dot 버튼 눌림')}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 제목 + 생성일 */}
        <PostTitle title={postData.title} date={postData.createdAt} />

        {/* 본문(문장 + 이미지) */}
        <PostContent contents={postData.contentResDtoList} />

        {/* “서사 모아보기” (상품 리스트) */}
        <PostItem products={postData.productResDtoList} />

        {/* 서점 정보 (우편번호 → 정적지도 렌더링) */}
        <PostInfo info={postData.bookstoreResDto} />

        {/* 댓글 입력 폼 */}
        <PostEditor />

        {/* 댓글 목록 */}
        <PostComment />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 40, justifyContent: 'center', alignItems: 'center',
  },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF',
  },
});
