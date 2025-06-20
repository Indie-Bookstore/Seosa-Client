import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,                      // 추가
} from "react-native";
import BookmarkIcon from "../../icons/bookmark_green.svg";
import UploadIcon from "../../icons/upload.svg";
import CommentIcon from "../../icons/comment_green.svg";
import SendIcon from "../../icons/send.svg";
import DeleteIcon from "../../icons/x.svg";
import ProfileIcon from "../../icons/profile.svg";
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get("window");


const PostComment = ({ comments = [], onSubmit }) => {

  const [commentText, setCommentText] = useState("");
  const user = useSelector(state => state.auth.user);
  const profileImage = user?.profileImage || null;

  const handleSubmit = () => {
    if (!commentText.trim()) {
      Alert.alert("알림", "댓글 내용을 입력해주세요.");
      return;
    }
    onSubmit(commentText);
    setCommentText("");
  };

  const ICON_SIZE = width * 0.067;
  const PROFILE_SIZE = width * 0.08;

  return (
    <View style={styles.container}>
      {/* 댓글 헤더 */}
      <View style={styles.comment_header}>
        <View style={styles.comment_count}>
          <CommentIcon height={ICON_SIZE} width={ICON_SIZE} />
          <Text style={styles.count}>{comments.length}</Text>
        </View>
        <View style={styles.interaction}>
          <TouchableOpacity>
            <BookmarkIcon height={ICON_SIZE} width={ICON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity>
            <UploadIcon height={ICON_SIZE} width={ICON_SIZE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 방문 후기 타이틀 */}
      <View style={styles.comment_title}>
        <Text style={styles.title_text}>방문 후기</Text>
        <Text style={styles.title_count}>{comments.length}</Text>
      </View>

      {/* 댓글 입력창 (아이콘은 그대로 사용) */}
      <View style={styles.comment_input}>
        <Image source={{ uri: profileImage }} style={{width: PROFILE_SIZE, height: PROFILE_SIZE}} />
        <TextInput
          style={styles.input}
          placeholder="방문후기를 입력하세요."
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={handleSubmit}>
          <SendIcon height={PROFILE_SIZE} width={PROFILE_SIZE} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      {/* 댓글 리스트 */}
      {comments.map((comment) => (
        <View key={comment.commentId} style={styles.comment}>
          <Image
            source={{ uri: comment.profileImgUrl }}
            style={[
              styles.profileImage,
              { width: PROFILE_SIZE, height: PROFILE_SIZE, borderRadius: PROFILE_SIZE / 2 },
            ]}
          />
          <View style={styles.commentContent}>
            <View style={styles.comment_up}>
              <Text style={styles.nickname}>{comment.name}</Text>
              <Text style={styles.date}>
                {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
  },
  comment_header: {
    height: height * 0.03,
    width: width * 0.9,
    flexDirection: "row",
    marginTop: height * 0.025,
    justifyContent: "space-between",
  },
  comment_count: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    color: "#487153",
  },
  interaction: {
    flexDirection: "row",
    width: width / 7,
    justifyContent: "space-between",
  },
  comment_title: {
    width: width * 0.9,
    height: height * 0.06,
    marginTop: height * 0.025,
    marginBottom: height * 0.01,
    flexDirection: "row",
  },
  title_text: {
    fontSize: height * 0.023,
    color: "#666666",
    fontWeight: "500",
    fontFamily: "Noto Sans",
    marginRight: width * 0.02,
  },
  title_count: {
    fontSize: height * 0.023,
    color: "#9EB3A4",
    fontWeight: "500",
    fontFamily: "Noto Sans",
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
  },
  profileImage: {
    backgroundColor: "#EEE",    // 로딩 중 빈 배경
  },
  commentContent: {
    marginLeft: width * 0.03,
    flex: 1,
  },
  comment_up: {
    height: width * 0.08,
  },
  nickname: {
    fontSize: height * 0.018,
    fontWeight: "500",
    color: "#000000",
  },
  date: {
    fontSize: height * 0.014,
    color: "#999999",
    marginTop: 5,
  },
  commentText: {
    fontSize: height * 0.018,
    color: "#333333",
    lineHeight: height * 0.025,
    marginTop: height * 0.01,
  },
});

export default PostComment;
