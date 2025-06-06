// src/components/post/PostList.js

import React, { useMemo } from "react";
import {
  Image,
  Text,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Radio from "../../icons/radio.svg";
import RadioSelected from "../../icons/radio-selected.svg";

const { width, height } = Dimensions.get("window");

// 3개씩 묶고 빈 자리 채우기
const chunkArrayWithPlaceholder = (arr, size) => {
  if (!arr || arr.length === 0) return [];

  const chunks = Array.from(
    { length: Math.ceil(arr.length / size) },
    (_, index) => arr.slice(index * size, index * size + size)
  );

  const lastRow = chunks[chunks.length - 1];
  while (lastRow.length < size) {
    lastRow.push({ postId: `placeholder-${lastRow.length}`, isPlaceholder: true });
  }
  return chunks;
};

/**
 * @param {object[]} posts                - API에서 받아온 포스트 객체 배열
 *     (각 객체는 { postId, title, thumbnailUrl, userId, userName, createdAt, … } 형태)
 * @param {boolean}  isEditing            - 편집 모드 여부
 * @param {number[]} selectedPosts        - 선택된 postId 배열
 * @param {function} setSelectedPosts     - 선택 토글 함수
 * @param {function} onItemPress          - (postId) => void. 클릭 시 호출
 */
const PostList = ({
  posts = [],
  isEditing = false,
  selectedPosts = [],
  setSelectedPosts = () => {},
  onItemPress = () => {},
}) => {
  // 1) postId 순 정렬 후 3개씩 묶고, 빈 자리는 placeholder로 채우기
  const chunkedPosts = useMemo(() => {
    if (!posts) return [];
    // API에서 받아온 posts는 postId 키를 사용하므로 post.postId 순으로 정렬
    const sortedPosts = [...posts].sort((a, b) => a.postId - b.postId);
    return chunkArrayWithPlaceholder(sortedPosts, 3);
  }, [posts]);

  // 2) 라디오 버튼 선택/해제
  const toggleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  return (
    <View style={styles.postlist}>
      {chunkedPosts.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.posts}>
          {row.map((post) => (
            <View
              key={post.postId}
              style={[styles.post, post.isPlaceholder && styles.placeholder]}
            >
              {!post.isPlaceholder && (
                <>
                  {/* 3) 포스트 카드를 터치 가능 영역으로 */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={StyleSheet.absoluteFill}
                    onPress={() => {
                      if (!isEditing) {
                        // 편집 모드가 아닐 때만 상세 페이지로 이동
                        onItemPress(post.postId);
                      }
                    }}
                  >
                    {/* 4) 이미지 렌더링: thumbnailUrl이 있을 때 네트워크, 없으면 로컬 플레이스홀더 */}
                    {post.thumbnailUrl ? (
                      <Image
                        source={{ uri: post.thumbnailUrl }}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={require("../../icons/thumbnail.jpg")}
                        style={styles.image}
                      />
                    )}

                    <LinearGradient
                      colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                      style={styles.gradient}
                    />
                    <Text style={styles.posttitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                  </TouchableOpacity>

                  {/* 5) 편집 모드일 때만 라디오 버튼 */}
                  {isEditing && (
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => toggleSelectPost(post.postId)}
                    >
                      {selectedPosts.includes(post.postId) ? (
                        <RadioSelected width={20} height={20} />
                      ) : (
                        <Radio width={20} height={20} />
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  postlist: {
    marginTop: height * 0.015,
  },
  posts: {
    flexDirection: "row",
    width: width * 0.9,
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  post: {
    width: (width * 5) / 18,
    height: (width * 5) / 18,
    position: "relative",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  placeholder: {
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "40%",
  },
  posttitle: {
    position: "absolute",
    bottom: 8,
    left: 5,
    color: "#FFFFFF",
    fontSize: height * 0.0125,
    fontWeight: "bold",
    width: "90%",
  },
  radioButton: {
    position: "absolute",
    top: 7,
    right: 7,
    borderRadius: 10,
  },
});

export default PostList;
