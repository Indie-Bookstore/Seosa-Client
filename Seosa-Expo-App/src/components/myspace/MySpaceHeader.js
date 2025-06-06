import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { navigate } from "../../utils/nav/RootNavigation";

import DotBtn from "../../icons/dot.svg";
import EditBtn from "../../icons/edit.svg";
import Bookmark from "../../icons/bookmark.svg";
import Comment from "../../icons/comment.svg";
import BookmarkSelected from "../../icons/bookmark-selected.svg";
import CommentSelected from "../../icons/comment-selected.svg";

import api from "../../api/axios";
import { logout } from "../../utils/logout"; // ★ 공통 로그아웃 함수

const { width, height } = Dimensions.get("window");
const size = width * 0.067;

export default function MySpaceHeader({
  selectedTab,
  setSelectedTab,
  profileImage,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);

  /* FAQ 화면 이동 */
  const handleFaq = () => navigate("FAQ");

  /* 로그아웃 */
  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
      { text: "아니오", style: "cancel" },
      {
        text: "예",
        onPress: () => logout(), // ★ 공통 로그아웃 호출
      },
    ]);
  };

  /* 회원 탈퇴 */
  const handleWithdrawal = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        { text: "아니오", style: "cancel" },
        {
          text: "예",
          onPress: async () => {
            try {
              await api.delete("/user"); // 서버 탈퇴
              await logout(); // ★ 탈퇴 후 동일 로그아웃 처리
            } catch (err) {
              console.error("회원 탈퇴 실패:", err);
              Alert.alert("오류", "회원 탈퇴에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  /* 프로필 수정 화면 이동 */
  const handleEdit = () => navigate("EditProfile");

  return (
    <View style={styles.container}>
      {/* 상태바 자리 */}
      <View style={styles.title}>
        <Text style={styles.titletext}>나의 공간</Text>
        <TouchableOpacity
          style={styles.dotbtn}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <DotBtn width={size} height={size} />
        </TouchableOpacity>
      </View>

      {/* 프로필 썸네일 */}
      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.image} />
          ) : (
            <View style={styles.image} />
          )}
          <TouchableOpacity style={styles.editbtn} onPress={handleEdit}>
            <EditBtn width={(size * 8) / 12} height={(size * 8) / 12} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 닉네임 */}
      <View style={styles.infoContainer}>
        <Text style={styles.nickname}>닉네임</Text>
        <Text style={styles.nicknameinput}>{user?.nickname || "책손님"}</Text>
      </View>

      {/* 탭 선택 */}
      <View style={styles.parts}>
        <TouchableOpacity
          style={selectedTab === "bookmark" ? styles.selectedPart : styles.part}
          onPress={() => setSelectedTab("bookmark")}
        >
          {selectedTab === "bookmark" ? <BookmarkSelected /> : <Bookmark />}
        </TouchableOpacity>

        <TouchableOpacity
          style={selectedTab === "comment" ? styles.selectedPart : styles.part}
          onPress={() => setSelectedTab("comment")}
        >
          {selectedTab === "comment" ? <CommentSelected /> : <Comment />}
        </TouchableOpacity>
      </View>

      {/* 토글 메뉴 */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleFaq}>
            <Text style={styles.menuText}>FAQ / 문의하기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleWithdrawal}>
            <Text style={[styles.menuText, styles.logoutText]}>탈퇴하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ───── 스타일 ───── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width,
    backgroundColor: "#487153",
    maxHeight: height * 0.3925,
    position: "relative",
  },
  title: {
    height: height * 0.0975,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width,
  },
  titletext: {
    color: "#FFFFFF",
    fontSize: width * 0.067,
    fontWeight: "bold",
    marginLeft: width * 0.05,
    fontFamily: "UnBatangBold",
  },
  dotbtn: { marginRight: width * 0.05 },

  /* 프로필 썸네일 */
  profileContainer: { height: height * 0.16625, width, alignItems: "center" },
  profile: {
    height: height * 0.16625,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  image: {
    height: height * 0.16625,
    width: height * 0.16625,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
  },
  editbtn: {
    position: "absolute",
    right: 5,
    bottom: 0,
    height: height * 0.0375,
    width: height * 0.0375,
    backgroundColor: "#FFFBEA",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  /* 닉네임 */
  infoContainer: {
    marginTop: height * 0.02,
    width,
    flexDirection: "row",
    height: height * 0.02875,
    justifyContent: "center",
    alignItems: "center",
  },
  nickname: {
    color: "#FFFFFF",
    fontSize: height * 0.023,
    fontWeight: "600",
    width: width * 0.125,
  },
  nicknameinput: { color: "#FFFFFF", fontSize: height * 0.02 },

  /* 탭 */
  parts: {
    width,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  part: {
    width: width / 2,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedPart: {
    width: width / 2,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#FFEEAA",
    borderBottomWidth: 2,
  },

  /* 메뉴 */
  menu: {
    position: "absolute",
    top: height * 0.0975 + 5,
    right: width * 0.05,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingVertical: 5,
    width: width * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 15 },
  menuText: { fontSize: 14, color: "#333" },
  logoutText: { color: "#FF3333", fontWeight: "bold" },
});
