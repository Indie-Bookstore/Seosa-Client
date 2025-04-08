import React, { useMemo } from "react";
import { Image, Text, StyleSheet, Dimensions, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Radio from "../../icons/radio.svg";
import RadioSelected from "../../icons/radio-selected.svg";

// 💡 3개씩 그룹화하는 함수 + 빈 자리 채우기
const chunkArrayWithPlaceholder = (arr, size) => {
  if (!arr || arr.length === 0) return [];

  // 3개씩 나누기
  const chunks = Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );

  // 마지막 행에 빈 공간 추가
  const lastRow = chunks[chunks.length - 1];
  while (lastRow.length < size) {
    lastRow.push({ id: `placeholder-${lastRow.length}`, isPlaceholder: true });
  }

  return chunks;
};

const PostList = ({ posts, isEditing, selectedPosts, setSelectedPosts }) => {
  // 🔹 최신 posts를 정렬한 후 3개씩 그룹화 (빈 아이템 포함)
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
            <View key={post.id} style={[styles.post, post.isPlaceholder && styles.placeholder]}>
              {!post.isPlaceholder && (
                <>
                  <Image source={post.image} style={styles.image} />
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
                  <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.6)"]} style={styles.gradient} />
                  <Text style={styles.posttitle}>{post.title}</Text>
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

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
