// src/components/admin/AdminPostList.js

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Alert, ScrollView } from "react-native";
import SmallButtonComponent from "../common/button/SmallButtonComponent";
import PostList from "../post/PostList";
import api from "../../api/axios";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const AdminPostList = ({ onItemPress }) => {
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
  const [selectedPosts, setSelectedPosts] = useState([]); // 선택된 postId 배열
  const [posts, setPosts] = useState([]); // 서버에서 받아온 게시글 리스트
  const [cursorId, setCursorId] = useState(null); // 다음 페이지를 위한 cursor
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) 내가 작성한 글 9개 조회
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const url = cursorId ? `/post/mypage?cursor=${cursorId}` : "/post/mypage";
      const response = await api.get(url);
      if (cursorId) {
        setPosts((prev) => [...prev, ...response.data.posts]);
      } else {
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
  const deleteSelectedPosts = () => {
    if (selectedPosts.length === 0) {
      Alert.alert("알림", "삭제할 글을 선택하세요.");
      return;
    }

    Alert.alert(
      "삭제 확인",
      "정말 선택한 글을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                selectedPosts.map((postId) => api.delete(`/post/${postId}`))
              );
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
      ]
    );
  };

  // 3) 다음 페이지 로드 (스크롤 끝에 도달 시)
  const loadMore = () => {
    if (hasNext && !loading) {
      fetchMyPosts();
    }
  };

  // 4) 편집 모드 토글
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSelectedPosts([]);
  };

  // 5) 개별 포스트 클릭 처리
  const handleItemPress = (postId) => {
    if (!isEditing) {
      onItemPress(postId);
    }
  };

  // 6) 포스트 리스트가 로드 중이고 빈 배열 상태면 로딩 화면
  if (loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더: '내가 작성한 글' + 편집/삭제 버튼 */}
      <View style={styles.bookmarkHeader}>
        <Text style={styles.headertitle}>내가 작성한 글</Text>
        <SmallButtonComponent
          btnType={isEditing ? "btn-red" : "btn-yellow"}
          description={isEditing ? "삭제" : "편집"}
          onPress={isEditing ? deleteSelectedPosts : toggleEditMode}
        />
      </View>

      {/* 포스트 리스트 (스크롤 가능) */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: height * 0.07 }}
        onMomentumScrollEnd={loadMore}
        showsVerticalScrollIndicator={false}
      >
        <PostList
          posts={posts.map((p) => ({
            postId: p.postId,
            title: p.title,
            thumbnailUrl: p.thumbnailUrl,
          }))}
          isEditing={isEditing}
          selectedPosts={selectedPosts}
          setSelectedPosts={setSelectedPosts}
          onItemPress={handleItemPress}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bookmarkHeader: {
    width: width * 0.9,
    height: height * 0.06,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headertitle: {
    fontSize: height * 0.02625,
    color: "#888888",
    fontWeight: "500",
  },
  scrollContainer: {
    width: width * 0.9,
    flex: 1,
  },
});

export default AdminPostList;
