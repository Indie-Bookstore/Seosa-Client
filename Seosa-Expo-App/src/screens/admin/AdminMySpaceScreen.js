import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { navigate } from "../../utils/nav/RootNavigation";

import Footer from "../../components/common/footer/Footer";
import AdminMySpaceHeader from "../../components/admin/AdminMySpaceHeader";
import AdminPostList from "../../components/admin/AdminPostList";
import MyBookmarkList from "../../components/myspace/MyBookmarkList";
import MyCommentList from "../../components/myspace/MyCommentList";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios"
    ? Constants.statusBarHeight
    : RNStatusBar.currentHeight || 0;

export default function AdminMySpaceScreen() {
  /* 모든 훅 선언 */
  const [selectedTab, setSelectedTab] = useState("write");
  const user = useSelector((state) => state.auth.user);
  const profileImage = user?.profileImage || null;

  /* ★ user가 없으면 화면을 렌더하지 않음 */
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />

      <AdminMySpaceHeader
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        profileImage={profileImage}
        nickname={user.nickname}
      />

      <View style={styles.content}>
        {selectedTab === "write" && (
          <AdminPostList
            onItemPress={(postId) => navigate("Post", { postId })}
          />
        )}
        {selectedTab === "bookmark" && (
          <MyBookmarkList
            onItemPress={(postId) => navigate("Post", { postId })}
          />
        )}
        {selectedTab === "comment" && (
          <MyCommentList
            onItemPress={(postId) => navigate("Post", { postId })}
          />
        )}
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFEFB", alignItems: "center" },
  content: { flex: 1, width: "100%" },
});
