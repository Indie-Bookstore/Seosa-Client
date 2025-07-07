// src/components/admin/AdminPostList.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import SmallButtonComponent from "../common/button/SmallButtonComponent";
import PostList from "../post/PostList";
import api from "../../api/axios";

const { width, height } = Dimensions.get("window");

export default function AdminPostList({ onItemPress }) {
  /* ---------------- 상태 ---------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // id = postId
  const [posts, setPosts] = useState([]);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- 글 목록 조회 ---------------- */
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const url = cursorId
        ? `/post/mypage?cursor=${cursorId}`
        : "/post/mypage";
      const { data } = await api.get(url);

      setPosts((prev) =>
        cursorId ? [...prev, ...data.posts] : data.posts,
      );
      setCursorId(data.cursorId);
      setHasNext(data.hasNext);
    } catch (err) {
      console.error(
        "내 글 조회 실패:",
        err.response?.data || err.message,
      );
      Alert.alert("오류", "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  /* ---------------- 선택 삭제 ---------------- */
  const deleteSelectedPosts = () => {
    if (!selectedIds.length) {
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
                selectedIds.map((id) => api.delete(`/post/${id}`)),
              );
              setPosts((prev) => prev.filter((p) => !selectedIds.includes(p.postId)));
              setSelectedIds([]);
              setIsEditing(false);
            } catch (err) {
              console.error(
                "게시글 삭제 실패:",
                err.response?.data || err.message,
              );
              Alert.alert("오류", "게시글 삭제에 실패했습니다.");
            }
          },
        },
      ],
    );
  };

  /* ---------------- 무한 스크롤 ---------------- */
  const loadMore = () => {
    if (hasNext && !loading) fetchMyPosts();
  };

  /* ---------------- 렌더 ---------------- */
  if (loading && posts.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headertitle}>내가 작성한 글</Text>
        <SmallButtonComponent
          btnType={isEditing ? "btn-red" : "btn-yellow"}
          description={isEditing ? "삭제" : "편집"}
          onPress={isEditing ? deleteSelectedPosts : () => {
            setIsEditing(!isEditing);
            setSelectedIds([]);
          }}
        />
      </View>

      {/* 리스트 */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: height * 0.07 }}
        onMomentumScrollEnd={loadMore}
        showsVerticalScrollIndicator={false}
      >
        <PostList
          posts={posts.map((p) => ({
            id: p.postId,
            title: p.title,
            image: p.thumbnailUrl
          }))}
          isEditing={isEditing}
          selectedPosts={selectedIds}
          setSelectedPosts={setSelectedIds}
          onItemPress={(postId) => !isEditing && onItemPress(postId)}
        />
      </ScrollView>
    </View>
  );
}

/* ---------------- 스타일 ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  header: {
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
