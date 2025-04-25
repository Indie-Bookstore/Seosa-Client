// 글 상세 화면

import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import PostHeader from "../../components/post/PostHeader";
import PostTitle from "../../components/post/PostTitle";
import PostContent from "../../components/post/PostContent";
import PostInfo from "../../components/post/PostInfo";
import PostEditor from "../../components/post/PostEditor";
import PostItem from "../../components/post/PostItem";
import PostComment from "../../components/post/PostComment";
// import api from "../../api/axios.js";

const dummyPost = {
  postId: 2,
  title: "부산 감성 서점 방문기",
  location: "부산 해운대구",
  thumbnailUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  bookstoreResDto: {
    bookstoreId: 2,
    postalCode: "48095",
    address: "부산 해운대구 우동",
    detailedAddress: "해운대역 5번 출구 인근",
    openDays: "화,수,목,금,토,일",
    openHours: "11:00~21:00",
    phoneNumber: "051-9876-5432",
    instagramLink: "https://instagram.com/busan_bookstore",
  },
  contentResDtoList: [
    {
      contentId: 4,
      contentType: "sentence",
      content: "해운대 바다가 보이는 감성적인 서점입니다.",
      order_index: 0,
    },
    {
      contentId: 5,
      contentType: "img_url",
      content: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXKw6XeZYHhVtlv5qvr7l2YMTyEkedy222IQ&s",
      order_index: 1,
    },
    {
      contentId: 6,
      contentType: "sentence",
      content: "이곳에서는 해양 문학과 관련된 다양한 책을 만나볼 수 있습니다.",
      order_index: 2,
    },
    {
      contentId: 7,
      contentType: "img_url",
      content: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXKw6XeZYHhVtlv5qvr7l2YMTyEkedy222IQ&s",
      order_index: 3,
    },
  ],
  productResDtoList: [],
};

const PostScreen = ({ navigation }) => {
  const STATUSBAR_HEIGHT =
    Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

  const [postData, setPostData] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // 🔸 API 호출 주석 처리하고 더미 데이터로 대체
    // const fetchPost = async () => {
    //   try {
    //     const res = await api.get(`/post/1`);
    //     setPostData(res.data);
    //   } catch (err) {
    //     console.error("게시글 불러오기 실패:", err);
    //   }
    // };
    // fetchPost();

    setPostData(dummyPost); // ✅ 더미 데이터로 설정
  }, []);

  if (!postData) return null;

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <PostHeader
        title="나의 공간"
        onBackPress={handleBack}
        onDotPress={() => console.log("Dot 버튼 눌림")}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PostTitle title={postData.title} date={"2025.04.08"} />
        <PostContent contents={postData.contentResDtoList} />
        <PostItem />
        <PostInfo info={postData.bookstoreResDto} />
        <PostEditor />
        <PostComment />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent:"center",
    alignItems:"center"
  },
  scrollContainer: {
    paddingBottom: 40,
    justifyContent:"center",
    alignItems:"center"
  },
});

export default PostScreen;
