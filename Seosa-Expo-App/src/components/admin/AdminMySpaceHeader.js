import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux"; // ✅ 추가
import DotBtn from "../../icons/dot.svg";
import EditBtn from "../../icons/edit.svg";
import Bookmark from "../../icons/bookmark.svg";
import Comment from "../../icons/comment.svg";
import Write from "../../icons/write.svg";
import BookmarkSelected from "../../icons/bookmark-selected.svg";
import CommentSelected from "../../icons/comment-selected.svg";
import WriteSelected from "../../icons/write-selected.svg";

const AdminMySpaceHeader = ({ selectedTab, setSelectedTab, navigation }) => {
  const size = Dimensions.get("window").width * 0.067;
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useSelector((state) => state.auth.user); // ✅ Redux에서 user 가져오기

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "아니오", style: "cancel" },
      { text: "예", onPress: () => console.log("로그아웃 진행") }, // TODO: 실제 로그아웃 처리
    ]);
  };

  const handleSettings = () => {
    navigation?.navigate("Settings");
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titletext}>나의 공간</Text>
        <TouchableOpacity
          style={styles.dotbtn}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <DotBtn width={size} height={size} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <View style={styles.image}></View>
          <TouchableOpacity style={styles.editbtn}>
            <EditBtn width={(size * 8) / 12} height={(size * 8) / 12} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 사용자 정보 */}
      <View style={styles.infoContainer}>
        <Text style={styles.nickname}>닉네임</Text>
        <Text style={styles.nicknameinput}>{user?.nickname || '책손님'}</Text> {/* ✅ 수정 */}
      </View>

      {/* 탭 */}
      <View style={styles.parts}>
        <TouchableOpacity
          style={selectedTab === "write" ? styles.selectedPart : styles.part}
          onPress={() => setSelectedTab("write")}
        >
          {selectedTab === "write" ? <WriteSelected /> : <Write />}
        </TouchableOpacity>

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
          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <Text style={styles.menuText}>설정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={[styles.menuText, styles.logoutText]}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// styles 그대로 유지
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: width,
    backgroundColor: "#487153",
    maxHeight: height * 0.3925,
    position: "relative",
  },
  title: {
    height: height * 0.0975,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
  },
  titletext: {
    color: "#FFFFFF",
    fontSize: width * 0.067,
    fontWeight: "bold",
    marginLeft: width * 0.05,
    fontFamily: "UnBatangBold",
  },
  dotbtn: {
    marginRight: width * 0.05,
  },
  profileContainer: {
    height: height * 0.16625,
    width: width,
    alignItems: "center",
  },
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
  infoContainer: {
    marginTop: height * 0.02,
    width: width,
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
  nicknameinput: {
    color: "#FFFFFF",
    fontSize: height * 0.02,
  },
  parts: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  part: {
    width: width / 3,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedPart: {
    width: width / 3,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#FFEEAA",
    borderBottomWidth: 2,
  },
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
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
  },
  logoutText: {
    color: "#FF3333",
    fontWeight: "bold",
  },
});

export default AdminMySpaceHeader;
