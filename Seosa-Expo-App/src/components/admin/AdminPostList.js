// src/components/admin/AdminPostList.js

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import PostList from "../post/PostList";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.06;
const PADDING_HORIZONTAL = width * 0.05;

const AdminPostList = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [posts, setPosts] = useState([]); // 서버에서 받아온 게시글 리스트
  const [cursorId, setCursorId] = useState(null); // 다음 페이지를 위한 cursor
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 1) 마이페이지에서 내가 쓴 글 9개 조회
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const url = cursorId
        ? `/post/mypage?cursor=${cursorId}`
        : "/post/mypage";
      const response = await api.get(url);
      // response.data: { posts: [...], cursorId: ..., hasNext: boolean }
      if (cursorId) {
        // 다음 페이지를 로드할 때
        setPosts((prev) => [...prev, ...response.data.posts]);
      } else {
        // 첫 로드
        setPosts(response.data.posts);
      }
      setCursorId(response.data.cursorId);
      setHasNext(response.data.hasNext);
    } catch (err) {
      console.error("내가 쓴 글 조회 실패:", err.response?.data || err.message);
      Alert.alert("오류", "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  // 2) 선택된 글 삭제
  const deleteSelectedPosts = async () => {
    if (selectedPosts.length === 0) {
      Alert.alert("알림", "삭제할 글을 선택하세요.");
      return;
    }

    Alert.alert("삭제 확인", "정말 선택한 글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            // 선택된 각 postId에 대해 DELETE 요청
            await Promise.all(
              selectedPosts.map((postId) => api.delete(`/post/${postId}`))
            );
            // 삭제 성공 후 로컬 상태에서 제거
            setPosts((prev) =>
              prev.filter((post) => !selectedPosts.includes(post.postId))
            );
            setSelectedPosts([]);
            setIsEditing(false);
          } catch (err) {
            console.error("게시글 삭제 실패:", err.response?.data || err.message);
            Alert.alert("오류", "게시글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  // 3) FlatList 하단에서 추가 페이지 로드
  const loadMore = () => {
    if (hasNext && !loading) {
      fetchMyPosts();
    }
  };

  // 4) FlatList 아이템 렌더러
  const renderItem = ({ item }) => (
    <PostList
      key={item.postId}
      posts={[item]}
      isEditing={isEditing}
      selectedPosts={selectedPosts}
      setSelectedPosts={setSelectedPosts}
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
      {/* 헤더 영역: 편집 / 삭제 버튼 */}
      <View style={styles.bookmarkHeader}>
        <Text style={styles.headertitle}>내가 작성한 글</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={isEditing ? deleteSelectedPosts : () => { setIsEditing(true); setSelectedPosts([]); }}
        >
          <Text style={styles.buttonText}>{isEditing ? "삭제" : "편집"}</Text>
        </TouchableOpacity>
      </View>

      {/* 게시글 리스트 */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        contentContainerStyle={{ paddingBottom: PADDING_HORIZONTAL }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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
  button: {
    backgroundColor: "#E2E7E3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: "#487153",
    fontWeight: "600",
  },
});

export default AdminPostList;
