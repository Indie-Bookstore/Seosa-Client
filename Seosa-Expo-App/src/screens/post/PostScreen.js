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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  // 게시글 데이터 불러오기
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

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comment/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('댓글 목록 불러오기 실패:', err);
      Alert.alert('오류', '댓글 목록을 불러오지 못했습니다.');
    }
  };

  // 댓글 초기 로딩
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 작성
  const handleAddComment = async (text) => {
    if (!text.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await api.post(`/comment/${postId}`, { text });
      fetchComments();  // 댓글 새로고침
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

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
        title={postData.title}
        onBackPress={handleBack}
        onDotPress={() => console.log('Dot 버튼 눌림')}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PostTitle title={postData.title} date={postData.createdAt} />
        <PostContent contents={postData.contentResDtoList} />
        <PostItem products={postData.productResDtoList} />
        <PostInfo info={postData.bookstoreResDto} />
        <PostEditor />
        <PostComment
          comments={comments}
          onSubmit={handleAddComment}
        />
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
