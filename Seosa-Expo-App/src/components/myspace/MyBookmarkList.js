// src/components/myspace/MyBookmarkList.js

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Alert, ScrollView } from "react-native";
import SmallButtonComponent from "../common/button/SmallButtonComponent";
import PostList from "../post/PostList";
import api from "../../api/axios";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const MyBookmarkList = ({ onItemPress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) 저장한 북마크 목록 9개 조회
  const fetchMyBookmarks = async () => {
    try {
      setLoading(true);
      const url = cursorId ? `/bookmark/mypage?cursor=${cursorId}` : "/bookmark/mypage";
      const response = await api.get(url);
      if (cursorId) {
        setBookmarks((prev) => [...prev, ...response.data.posts]);
      } else {
        setBookmarks(response.data.posts);
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

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSelectedPosts([]);
  };

  const deleteSelectedPosts = () => {
    if (selectedPosts.length === 0) {
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
          onPress: () => {
            const updated = bookmarks.filter((post) => !selectedPosts.includes(post.postId));
            setBookmarks(updated);
            setSelectedPosts([]);
            setIsEditing(false);
          },
        },
      ]
    );
  };

  if (loading && bookmarks.length === 0) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bookmarkHeader}>
        <Text style={styles.headertitle}>내가 저장한 글</Text>
        <SmallButtonComponent
          btnType={isEditing ? "btn-red" : "btn-yellow"}
          description={isEditing ? "삭제" : "편집"}
          onPress={isEditing ? deleteSelectedPosts : toggleEditMode}
        />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: height * 0.07 }}
        onMomentumScrollEnd={loadMore}
        showsVerticalScrollIndicator={false}
      >
        <PostList
          posts={bookmarks.map((p) => ({
            postId: p.postId,
            title: p.title,
            thumbnailUrl: p.thumbnailUrl,
          }))}
          isEditing={isEditing}
          selectedPosts={selectedPosts}
          setSelectedPosts={setSelectedPosts}
          onItemPress={(postId) => onItemPress(postId)}
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

export default MyBookmarkList;
