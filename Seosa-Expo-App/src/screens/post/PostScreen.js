import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import api from "../../api/axios.js";
import SafeTopSpacer from "../../components/common/layout/SafeTopSpacer.js";

import PostHeader from "../../components/post/PostHeader";
import PostTitle from "../../components/post/PostTitle";
import PostContent from "../../components/post/PostContent";
import PostInfo from "../../components/post/PostInfo";
import PostItem from "../../components/post/PostItem";
import PostEditor from "../../components/post/PostEditor";
import PostComment from "../../components/post/PostComment";

export default function PostScreen({ navigation, route }) {
  const { postId } = route.params;

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 날짜 포맷 */
  const formatDate = (str) =>
    str ? str.replace(/-/g, ".").replace(" ", " ") : "";

  /* 뒤로가기 */
  const handleBack = () => navigation.goBack();

  /* 글 삭제 */
  const handleDelete = useCallback(async () => {
    try {
      await api.delete(`/post/${postId}`);
      Alert.alert("알림", "글이 삭제되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            const reset = CommonActions.reset({
              index: 0,
              routes: [{ name: "gallery" }],
            });
            (navigation.getParent() ?? navigation).dispatch(reset);
          },
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("오류", err.response?.data?.message ?? "글 삭제 실패");
    }
  }, [postId, navigation]);

  /* 글 조회 */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/post/${postId}`);
        setPostData({ ...data, createdAtFormatted: formatDate(data.createdAt) });
      } catch (e) {
        console.error(e);
        Alert.alert("오류", "게시글을 불러오지 못했습니다.");
        navigation.goBack();
      } finally {
        setLoading(false);
        console.log(postData);
      }
    })();
  }, [postId]);

  /* 댓글 조회 */
  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comment/post/${postId}`);
      setComments(data);
    } catch (e) {
      console.error(e);
      Alert.alert("오류", "댓글 목록을 불러오지 못했습니다.");
    }
  };
  useEffect(() => {
    fetchComments();
  }, [postId]);

  /* 댓글 작성 */
  const handleAddComment = async (text) => {
    if (!text.trim()) {
      Alert.alert("알림", "댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await api.post(`/comment/${postId}`, { text });
      fetchComments();
    } catch (e) {
      console.error(e);
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
    }
  };

  /* 로딩 */
  if (loading || !postData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#487153" />
      </View>
    );
  }

  /* 삭제 권한 여부 */
  const canDelete = ["EDITOR", "ADMIN"].includes(postData.userRole);

  /* 본문 */
  return (
    <KeyboardAvoidingView
      style={styles.kbWrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeTopSpacer />
      <PostHeader
        title={postData.title}
        onBackPress={handleBack}
        onDeletePress={handleDelete}
        canDelete={canDelete}
        postId={postId}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <PostTitle title={postData.title} date={postData.createdAtFormatted} />
        <PostContent contents={postData.contentResDtoList} />

        {postData.productResDtoList?.length ? (
          <PostItem products={postData.productResDtoList} />
        ) : null}

        <PostInfo info={postData.bookstoreResDto} />
        <PostEditor
          nickname={postData.nickname}
          profileUrl={postData.profileUrl}
          userRole={postData.userRole}
        />
      
        <PostComment
          postId={postId}
          comments={comments}
          onSubmit={handleAddComment}
          isBookmarked={postData.isBookmarked}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ───── 스타일 ───── */
const styles = StyleSheet.create({
  kbWrapper: { flex: 1, backgroundColor: "#FFF" },
  scrollContainer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
});
