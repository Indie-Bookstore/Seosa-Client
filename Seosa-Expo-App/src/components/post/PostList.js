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

// 3개씩 그룹화하는 함수 + 빈 자리 채우기
const chunkArrayWithPlaceholder = (arr, size) => {
  if (!arr || arr.length === 0) return [];

  const chunks = Array.from(
    { length: Math.ceil(arr.length / size) },
    (_, index) => arr.slice(index * size, index * size + size)
  );

  const lastRow = chunks[chunks.length - 1];
  while (lastRow.length < size) {
    // placeholder용 id 값은 “placeholder-<index>” 형태로 고유하게 생성
    lastRow.push({ id: `placeholder-${lastRow.length}`, isPlaceholder: true });
  }

  return chunks;
};

/**
 * @param {object[]} posts                - 포스트 배열 (각 객체는 { id, title, image } 형태)
 * @param {boolean}  isEditing            - 편집 모드 여부
 * @param {number[]} selectedPosts        - 선택된 post ID 배열
 * @param {function} setSelectedPosts     - 선택 토글 함수
 * @param {function} onItemPress          - (postId) => void, 카드 클릭 시 호출
 */
const PostList = ({
  posts = [],
  isEditing = false,
  selectedPosts = [],
  setSelectedPosts = () => {},
  onItemPress = () => {},
}) => {
  // posts를 id 순으로 정렬한 뒤 3개씩 그룹화(빈 자리 placeholder 포함)
  const chunkedPosts = useMemo(() => {
    if (!posts) return [];
    const sortedPosts = [...posts].sort((a, b) => a.id - b.id);
    return chunkArrayWithPlaceholder(sortedPosts, 3);
  }, [posts]);

  // 라디오 버튼 선택/해제
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
              key={post.id}
              style={[styles.post, post.isPlaceholder && styles.placeholder]}
            >
              {!post.isPlaceholder && (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={StyleSheet.absoluteFill}
                    onPress={() => {
                      if (!isEditing) {
                        onItemPress(post.id);
                      }
                    }}
                  >
                    <Image source={post.image} style={styles.image} />

                    <LinearGradient
                      colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
                      style={styles.gradient}
                    />
                    <Text style={styles.posttitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                  </TouchableOpacity>

                  {isEditing && (
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => toggleSelectPost(post.id)}
                    >
                      {selectedPosts.includes(post.id) ? (
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
