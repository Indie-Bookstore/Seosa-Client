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

export default function MyCommentList({ onItemPress }) {
  /* --------------- 상태 --------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);       // commentId 배열
  const [comments, setComments] = useState([]);             // [{commentId, postId, ...}]
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  /* --------------- 댓글 목록 조회 --------------- */
  const fetchMyComments = async () => {
    try {
      setLoading(true);
      const url = cursorId
        ? `/comment/mypage?cursor=${cursorId}`
        : "/comment/mypage";
      const { data } = await api.get(url);

      const mapped = data.comments.map((c) => ({
        commentId: c.commentId,
        postId: c.postId,
        title: c.title,
        thumbnailUrl: c.thumbnailUrl,
      }));

      setComments((prev) => (cursorId ? [...prev, ...mapped] : mapped));
      setCursorId(data.cursorId);
      setHasNext(data.hasNext);
    } catch (err) {
      console.error(
        "내 댓글 목록 조회 실패:",
        err.response?.data || err.message,
      );
      Alert.alert("오류", "댓글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, []);

  const loadMore = () => {
    if (hasNext && !loading) fetchMyComments();
  };

  /* --------------- 편집/삭제 --------------- */
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    if (!selectedIds.length) {
      Alert.alert("알림", "삭제할 항목을 선택하세요.");
      return;
    }

    Alert.alert(
      "삭제 확인",
      "정말 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              /* 1) 서버 삭제 */
              await Promise.all(
                selectedIds.map((id) => api.delete(`/comment/${id}`)),
              );

              Alert.alert("삭제 완료되었습니다.");

              /* 2) 프론트 목록 갱신 */
              setComments((prev) =>
                prev.filter((c) => !selectedIds.includes(c.commentId)),
              );
              setSelectedIds([]);
              setIsEditing(false);
            } catch (err) {
              console.error(
                "댓글 삭제 실패:",
                err.response?.data || err.message,
              );
              Alert.alert("오류", "댓글 삭제에 실패했습니다.");
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  /* --------------- 로딩 상태 --------------- */
  if (loading && comments.length === 0) return <View style={styles.container} />;

  /* --------------- 렌더 --------------- */
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headertitle}>방문 후기</Text>
        <SmallButtonComponent
          btnType={isEditing ? "btn-red" : "btn-yellow"}
          description={isEditing ? "삭제" : "편집"}
          onPress={isEditing ? deleteSelected : toggleEdit}
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
          posts={comments.map((c) => ({
            id: c.commentId, // 선택용 고유 ID
            title: c.title,
            image: c.thumbnailUrl ? { uri: c.thumbnailUrl } : undefined,
          }))}
          isEditing={isEditing}
          selectedPosts={selectedIds}
          setSelectedPosts={setSelectedIds}
          /* 댓글 눌렀을 때 → 원 글 상세로 이동 */
          onItemPress={(commentId) => {
            const target = comments.find((c) => c.commentId === commentId);
            if (target) onItemPress?.(target.postId);
          }}
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
