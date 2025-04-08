import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text, Alert } from "react-native";
import SmallButtonComponent from "../common/button/SmallButtonComponent";
import PostList from "../post/PostList";

const MyCommentList = () => {

  const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
  const [selectedPosts, setSelectedPosts] = useState([]); // 선택된 post ID 배열

  // 북마크 리스트 (더미 데이터)
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: "가나다라마바사아자차카파타하", image: require("../../icons/thumbnail.jpg") },
    { id: 2, title: "ABCDEFG", image: require("../../icons/thumbnail.jpg") },
    { id: 3, title: "1234567890", image: require("../../icons/thumbnail.jpg") },
    { id: 4, title: "테스트 데이터", image: require("../../icons/thumbnail.jpg") },
    { id: 5, title: "React Native", image: require("../../icons/thumbnail.jpg") },
    { id: 6, title: "Post Item", image: require("../../icons/thumbnail.jpg") },
    { id: 7, title: "New Data", image: require("../../icons/thumbnail.jpg") },
    { id: 8, title: "가나다라마바사아자차카파타하", image: require("../../icons/thumbnail.jpg") },
    { id: 9, title: "ABCDEFG", image: require("../../icons/thumbnail.jpg") },
    { id: 10, title: "1234567890", image: require("../../icons/thumbnail.jpg") },
    { id: 11, title: "테스트 데이터", image: require("../../icons/thumbnail.jpg") },
    { id: 12, title: "React Native", image: require("../../icons/thumbnail.jpg") },
    { id: 13, title: "Post Item", image: require("../../icons/thumbnail.jpg") },
    { id: 14, title: "New Data", image: require("../../icons/thumbnail.jpg") },
  ]);

  // 편집 버튼 클릭 시 토글
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSelectedPosts([]); // 편집 모드 종료 시 선택 목록 초기화
  };

  // 선택된 post 삭제 (Alert 추가)
  const deleteSelectedPosts = () => {
    if (selectedPosts.length === 0) {
      Alert.alert("알림", "삭제할 항목을 선택하세요.");
      return;
    }

    Alert.alert(
      "삭제 확인",
      "정말 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            const updatedBookmarks = bookmarks.filter((post) => !selectedPosts.includes(post.id));
            console.log("삭제 후 업데이트될 bookmarks:", updatedBookmarks);

            setBookmarks([...updatedBookmarks]); // 변경 감지 강제
            setSelectedPosts([]);
            setIsEditing(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.bookmarkHeader}>
        <Text style={styles.headertitle}>방문 후기</Text>
        <SmallButtonComponent
          btnType={isEditing ? "btn-red" : "btn-yellow"}
          description={isEditing ? "삭제" : "편집"}
          onPress={isEditing ? deleteSelectedPosts : toggleEditMode}
        />
      </View>

      {/* PostList 컴포넌트 사용 (편집 모드 및 선택 기능 추가) */}
      <PostList
        posts={bookmarks}
        isEditing={isEditing}
        selectedPosts={selectedPosts}
        setSelectedPosts={setSelectedPosts}
      />
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

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
});

export default MyCommentList;
