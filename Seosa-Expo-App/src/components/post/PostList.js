import React, { useMemo } from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Radio from "../../icons/radio.svg";
import RadioSelected from "../../icons/radio-selected.svg";

const { width, height } = Dimensions.get("window");

/* 3칸씩 묶고 남으면 placeholder */
const chunk3 = (arr) => {
  const out = [];
  for (let i = 0; i < arr.length; i += 3) {
    const slice = [...arr.slice(i, i + 3)];
    while (slice.length < 3) slice.push({ isPlaceholder: true });
    out.push(slice);
  }
  return out;
};

export default function PostList({
  posts = [],
  isEditing = false,
  selectedPosts = [],
  setSelectedPosts = () => {},
  onItemPress = () => {},
}) {
  /* _id = id || postId   image = image || {uri:thumbnailUrl} */
  const normalized = useMemo(
    () =>
      posts.map((p) => ({
        ...p,
        _id: p.id ?? p.postId,
        _image: p.image ?? (p.thumbnailUrl ? { uri: p.thumbnailUrl } : undefined),
      })),
    [posts],
  );

  const rows = useMemo(() => {
    const sorted = [...normalized].filter((v) => v._id != null);
    sorted.sort((a, b) => a._id - b._id);
    return chunk3(sorted);
  }, [normalized]);

  const toggle = (id) =>
    selectedPosts.includes(id)
      ? setSelectedPosts(selectedPosts.filter((v) => v !== id))
      : setSelectedPosts([...selectedPosts, id]);

  return (
    <View style={styles.postlist}>
      {rows.map((row, r) => (
        <View key={`row-${r}`} style={styles.posts}>
          {row.map((p, c) =>
            p.isPlaceholder ? (
              <View
                key={`ph-${r}-${c}`}
                style={[styles.post, styles.placeholder]}
              />
            ) : (
              <View key={p._id} style={styles.post}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={StyleSheet.absoluteFill}
                  onPress={() => !isEditing && onItemPress(p._id)}
                >
                  {p._image && <Image source={p._image} style={styles.image} />}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.6)"]}
                    style={styles.gradient}
                  />
                  <Text numberOfLines={1} style={styles.posttitle}>
                    {p.title}
                  </Text>
                </TouchableOpacity>

                {isEditing && (
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => toggle(p._id)}
                  >
                    {selectedPosts.includes(p._id) ? (
                      <RadioSelected width={20} height={20} />
                    ) : (
                      <Radio width={20} height={20} />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ),
          )}
        </View>
      ))}
    </View>
  );
}

/* ── style (동일, 이름만 정리) ── */
const styles = StyleSheet.create({
  postlist: { marginTop: height * 0.015 },
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
  placeholder: { backgroundColor: "transparent" },
  image: { width: "100%", height: "100%" },
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
    color: "#FFF",
    fontSize: height * 0.0125,
    fontFamily:"NotoSansBold",
    width: "90%",
  },
  radioButton: {
    position: "absolute",
    top: 7,
    right: 7,
  },
});
