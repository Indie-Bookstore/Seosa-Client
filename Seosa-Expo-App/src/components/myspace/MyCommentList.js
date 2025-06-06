// src/components/myspace/MyCommentList.js

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import api from "../../api/axios";
import PostList from "../post/PostList"; // PostList가 단일 포스트 배열로 렌더링한다고 가정

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.06;
const PADDING_HORIZONTAL = width * 0.05;

const MyCommentList = ({ onItemPress }) => {
  const [posts, setPosts] = useState([]); // 댓글 단 게시글 리스트
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) 내 댓글 단 게시글 목록 9개 조회
  const fetchMyComments = async () => {
    try {
      setLoading(true);
      const url = cursorId
        ? `/comment/mypage?cursor=${cursorId}`
        : "/comment/mypage";
      const response = await api.get(url);
      // response.data: { posts: [...], cursorId: ..., hasNext: boolean }
      if (cursorId) {
        setPosts((prev) => [...prev, ...response.data.posts]);
      } else {
        setPosts(response.data.posts);
      }
      setCursorId(response.data.cursorId);
      setHasNext(response.data.hasNext);
    } catch (err) {
      console.error("내 댓글 목록 조회 실패:", err.response?.data || err.message);
      Alert.alert("오류", "댓글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, []);

  const loadMore = () => {
    if (hasNext && !loading) {
      fetchMyComments();
    }
  };

  const renderItem = ({ item }) => (
    <PostList
      key={item.postId}
      posts={[item]}
      onItemPress={() => onItemPress(item.postId)}
    />
  );

  if (loading && !posts.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#487153" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더: 단순 “방문 후기” 타이틀 */}
      <View style={styles.bookmarkHeader}>
        <Text style={styles.headertitle}>방문 후기</Text>
      </View>

      {/* 댓글 단 게시글 리스트 */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        contentContainerStyle={{ paddingBottom: PADDING_HORIZONTAL }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkHeader: {
    width: width * 0.9,
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  headertitle: {
    fontSize: height * 0.02625,
    color: "#888888",
    fontWeight: "500",
  },
});

export default MyCommentList;
