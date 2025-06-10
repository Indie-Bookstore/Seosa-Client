import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import LogoIcon from "../../icons/logo-green.svg";
import EditIcon from "../../icons/edit-white.svg";
import Post from "../../components/post/Post";
import Footer from "../../components/common/footer/Footer";
import { navigate } from "../../utils/nav/RootNavigation"; // navigation prop 대신 이거만 사용
import api from "../../api/axios";
import { useRequireAuth } from "../../hooks/useRequireAuth";

const { width, height } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = width - CARD_MARGIN * 2;
const OFFSET = width * 0.05;
const STATUSBAR_HEIGHT = Constants.statusBarHeight;
const size = width * 0.1;

const PostGalleryScreen = ({ navigation }) => {
  const isLoggedIn = useRequireAuth();
  if (!isLoggedIn) return null;

  const [posts, setPosts] = useState([]);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    try {
      const response = await api.get("/post/main", {
        params: { cursor: cursorId },
      });
      const { posts: newPosts, cursorId: newCursorId, hasNext: newHasNext } =
        response.data;
      setPosts((prev) => [...prev, ...newPosts]);
      setCursorId(newCursorId);
      setHasNext(newHasNext);
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      Alert.alert("오류", "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [cursorId, hasNext, loading]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.logoSection, { paddingTop: STATUSBAR_HEIGHT }]}>
        <LogoIcon width={size} height={size} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        onMomentumScrollEnd={() => {
          if (hasNext && !loading) fetchPosts();
        }}
      >
        <View style={styles.titlecontainer}>
          <View style={[styles.firstline, { paddingLeft: OFFSET }]}>
            <View style={styles.linecontainer}>
              <Text style={styles.title}>글모음</Text>
              <View style={styles.rightline} />
            </View>
          </View>
          <View style={[styles.secondline, { paddingRight: OFFSET }]}>
            <View style={styles.linecontainer}>
              <View style={styles.leftline} />
              <Text style={styles.subtext}>
                독립출판물을 사랑하는 사람들의 이야기
              </Text>
            </View>
          </View>
        </View>

        {posts.map((item) => (
          <View
            key={item.postId}
            style={[
              styles.cardWrapper,
              { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
            ]}
          >
            <Post
              id={item.postId}
              title={item.title}
              date={new Date(item.createdAt).toLocaleDateString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
              nickname={item.userName}
              image={
                item.thumbnailUrl
                  ? { uri: item.thumbnailUrl }
                  : require("../../icons/thumbnail-large.jpg")
              }
              onPress={() =>
                // navigation prop 대신 RootNavigation의 navigate 사용
                navigate("Post", { postId: item.postId })
              }
            />
          </View>
        ))}

        {loading && (
          <ActivityIndicator
            style={{ marginVertical: 20 }}
            size="large"
            color="#487153"
          />
        )}

        <View style={{ height: height * 0.08 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          // 이전에 사용하던 navigation.navigate → navigate 로 변경
          navigate("article")
        }
      >
        <EditIcon width={28} height={28} />
      </TouchableOpacity>

      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBEA", alignItems: "center" },
  logoSection: {
    flexDirection: "row",
    width: width * 0.9,
    height: height * 0.15,
    backgroundColor: "#FFFBEA",
    alignItems: "center",
    zIndex: 10,
  },
  scrollContainer: { paddingTop: 0 },
  titlecontainer: { width: width, marginBottom: 16 },
  linecontainer: {
    flexDirection: "row",
    width: width * 0.95,
    alignItems: "center",
    justifyContent: "space-between",
  },
  firstline: { flexDirection: "row", alignItems: "center", width: width },
  secondline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width,
    height: height * 0.05,
  },
  title: {
    fontSize: height * 0.045,
    color: "#487153",
    textAlign: "center",
    fontFamily: "Unbatang-Bold",
  },
  rightline: { height: 2, backgroundColor: "#487153", width: width * 0.6 },
  leftline: { height: 2, backgroundColor: "#487153", width: width * 0.35 },
  subtext: {
    fontSize: height * 0.017,
    color: "#487153",
    fontFamily: "Unbatang-Bold",
  },
  cardWrapper: { marginBottom: 20, alignSelf: "center" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: height * 0.09,
    backgroundColor: "#487153",
    borderRadius: 28,
    width: height * 0.06,
    height: height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    elevation: 5,
  },
});

export default PostGalleryScreen;
