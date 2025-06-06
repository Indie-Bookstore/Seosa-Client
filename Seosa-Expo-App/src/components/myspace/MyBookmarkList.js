// src/components/myspace/MyBookmarkList.js

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
import PostList from "../post/PostList";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.06;
const PADDING_HORIZONTAL = width * 0.05;

const MyBookmarkList = ({ onItemPress }) => {
  const [posts, setPosts] = useState([]); // 저장한 게시글 리스트
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) 저장한 북마크 목록 9개 조회
  const fetchMyBookmarks = async () => {
    try {
      setLoading(true);
      const url = cursorId
        ? `/bookmark/mypage?cursor=${cursorId}`
        : "/bookmark/mypage";
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
      console.error("북마크 목록 조회 실패:", err.response?.data || err.message);
      Alert.alert("오류", "저장한 글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookmarks();
  }, []);

  const loadMore = () => {
    if (hasNext && !loading) {
      fetchMyBookmarks();
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
      {/* 헤더: 단순 “내가 저장한 글” 타이틀 */}
      <View style={styles.bookmarkHeader}>
        <Text style={styles.headertitle}>내가 저장한 글</Text>
      </View>

      {/* 저장한 게시글 리스트 */}
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

export default MyBookmarkList;
