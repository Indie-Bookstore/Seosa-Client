import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { navigate } from "../../utils/nav/RootNavigation";
import SafeTopSpacer from "../../components/common/layout/SafeTopSpacer";

import Footer from "../../components/common/footer/Footer";
import AdminMySpaceHeader from "../../components/admin/AdminMySpaceHeader";
import AdminPostList from "../../components/admin/AdminPostList";
import MyBookmarkList from "../../components/myspace/MyBookmarkList";
import MyCommentList from "../../components/myspace/MyCommentList";

export default function AdminMySpaceScreen() {
  const [selectedTab, setSelectedTab] = useState("write");
  const user = useSelector((state) => state.auth.user);
  const profileImage = user?.profileImage || null;

  if (!user) return null;

  return (
    <View style={styles.container}>
      <SafeTopSpacer />

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
  container: { flex: 1, backgroundColor: "#487153", alignItems: "center" },
  content: { flex: 1, width: "100%", backgroundColor: "#FFFEFB" },
});
