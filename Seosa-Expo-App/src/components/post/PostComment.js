import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import * as Clipboard from "expo-clipboard";

import BookmarkIcon from "../../icons/bookmark_green.svg";
import BookmarkedIcon from "../../icons/bookmark-green-sellected.svg";
import UploadIcon from "../../icons/upload.svg";
import CommentIcon from "../../icons/comment_green.svg";
import SendIcon from "../../icons/send.svg";
import DeleteIcon from "../../icons/x.svg";
import ProfileIcon from "../../icons/profile.svg";

const { width, height } = Dimensions.get("window");
const ICON_SIZE = width * 0.067;
const PROFILE_SIZE = width * 0.08;

export default function PostComment({
  postId,
  comments: propComments = [],
  onSubmit = () => {},
}) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(propComments);
  const [bookmarked, setBookmarked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => setComments(propComments), [propComments]);

  const user = useSelector((s) => s.auth.user);
  const profileImage = user?.profileImage || null;

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  const handleCopyUrl = async () => {
    const url = `seosa://post/${postId}`;
    try {
      await Clipboard.setStringAsync(url);
      Alert.alert("알림", "URL이 복사되었습니다.");
    } catch (e) {
      console.error(e);
      Alert.alert("오류", "URL 복사에 실패했습니다.");
    }
    setMenuVisible(false);
  };

  const handleSubmit = () => {
    const txt = commentText.trim();
    if (!txt) {
      Alert.alert("알림", "댓글 내용을 입력하세요.");
      return;
    }
    onSubmit(txt);
    setComments((prev) => [
      ...prev,
      {
        commentId: `tmp-${Date.now()}`,
        isPending: true,
        isMyComment: true,
        name: user?.nickname ?? "나",
        profileImgUrl: profileImage,
        text: txt,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentText("");
  };

  const handleBookmark = async () => {
    if (bookmarked) return;
    try {
      await api.post(`/${postId}/bookmark`);
      setBookmarked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (c) => {
    if (c.isPending) return;
    Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel", onPress: () => setMenuVisible(false) },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setMenuVisible(false);
          try {
            await api.delete(`/comment/${c.commentId}`);
            setComments((prev) =>
              prev.filter((v) => v.commentId !== c.commentId)
            );
          } catch (err) {
            console.error(err);
            Alert.alert("오류", "댓글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {menuVisible && <Pressable style={styles.overlay} onPress={toggleMenu} />}

      <View style={styles.comment_header}>
        <View style={styles.comment_count}>
          <CommentIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text style={styles.count}>{comments.length}</Text>
        </View>
        <View style={styles.interaction}>
          <TouchableOpacity onPress={handleBookmark}>
            {bookmarked ? (
              <BookmarkedIcon width={ICON_SIZE} height={ICON_SIZE} />
            ) : (
              <BookmarkIcon width={ICON_SIZE} height={ICON_SIZE} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMenu}>
            <UploadIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleCopyUrl}>
            <Text style={styles.menuText}>URL 복사하기</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.comment_title}>
        <Text style={styles.title_text}>방문 후기</Text>
        <Text style={styles.title_count}>{comments.length}</Text>
      </View>

      <View style={styles.comment_input}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={{
              width: PROFILE_SIZE,
              height: PROFILE_SIZE,
              borderRadius: PROFILE_SIZE / 2,
            }}
          />
        ) : (
          <ProfileIcon width={PROFILE_SIZE} height={PROFILE_SIZE} />
        )}

        <TextInput
          style={styles.input}
          placeholder="방문후기를 입력하세요."
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
        />

        <TouchableOpacity onPress={handleSubmit}>
          <SendIcon width={PROFILE_SIZE} height={PROFILE_SIZE} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      {comments.map((c, idx) => (
        <View key={`${c.commentId}-${idx}`} style={styles.comment}>
          {c.profileImgUrl ? (
            <Image
              source={{ uri: c.profileImgUrl }}
              style={{
                width: PROFILE_SIZE,
                height: PROFILE_SIZE,
                borderRadius: PROFILE_SIZE / 2,
              }}
            />
          ) : (
            <ProfileIcon width={PROFILE_SIZE} height={PROFILE_SIZE} />
          )}

          <View style={styles.commentContent}>
            <View style={styles.comment_up}>
              <Text style={styles.nickname}>{c.name}</Text>
              <Text style={styles.date}>
                {new Date(c.createdAt).toLocaleDateString("ko-KR", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
            </View>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>

          {c.isMyComment && !c.isPending && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(c)}
            >
              <DeleteIcon width={PROFILE_SIZE} height={PROFILE_SIZE} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 15 },
  comment_header: {
    height: height * 0.03,
    width: width * 0.9,
    flexDirection: "row",
    marginTop: height * 0.025,
    justifyContent: "space-between",
    zIndex: 20,
  },
  comment_count: { flexDirection: "row", alignItems: "center" },
  count: { color: "#487153" },
  interaction: {
    flexDirection: "row",
    width: width / 7,
    justifyContent: "space-between",
  },
  menuContainer: {
    position: "absolute",
    top: height * 0.07,
    right: width * 0.05,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 5,
    width: width * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 25,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 15 },
  menuText: { fontSize: 14, color: "#333" },
  comment_title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.025,
    marginBottom: height * 0.01,
    flexDirection: "row",
  },
  title_text: {
    fontSize: height * 0.023,
    color: "#666",
    fontWeight: "500",
    marginRight: width * 0.02,
  },
  title_count: {
    fontSize: height * 0.023,
    color: "#9EB3A4",
    fontWeight: "500",
  },
  comment_input: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.9,
    alignItems: "center",
  },
  input: {
    width: width * 0.7,
    height: height * 0.045,
    borderColor: "#E1E1E1",
    borderWidth: height * 0.002,
    borderRadius: 5,
    padding: 10,
  },
  line: {
    width: width * 0.9,
    backgroundColor: "#E1E1E1",
    height: height * 0.001,
    marginTop: height * 0.025,
    marginBottom: height * 0.025,
  },
  comment: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: width * 0.9,
    marginBottom: height * 0.02,
    position: "relative",
  },
  commentContent: { marginLeft: width * 0.03, flex: 1 },
  comment_up: { height: PROFILE_SIZE },
  nickname: { fontSize: height * 0.018, fontWeight: "500" },
  date: { fontSize: height * 0.014, color: "#999", marginTop: 5 },
  commentText: {
    fontSize: height * 0.018,
    color: "#333",
    lineHeight: height * 0.025,
    marginTop: height * 0.01,
  },
  deleteBtn: { position: "absolute", top: 0, right: 0, padding: 4 },
});
