import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import Constants from "expo-constants";
import LogoIcon from "../../icons/logo-green.svg";
import EditIcon from "../../icons/edit-white.svg";
import Post from "../../components/post/Post";
import Footer from "../../components/common/footer/Footer";
import { navigate } from "../../utils/nav/RootNavigation";

const posts = [
  {
    id: "1",
    title: "제목 예시입니다.",
    date: "24.12.07",
    nickname: "닉네임",
    image: require("../../icons/thumbnail-large.jpg"),
  },
  {
    id: "2",
    title: "제목예시가나다라마바사아자차카파타하가갸거겨고교구규그기",
    date: "24.12.07",
    nickname: "닉네임",
    image: require("../../icons/thumbnail-large.jpg"),
  },
];

const { width, height } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = width - CARD_MARGIN * 2;
const OFFSET = width * 0.05;
const STATUSBAR_HEIGHT =
  Platform.OS === "ios"
    ? Constants.statusBarHeight
    : RNStatusBar.currentHeight || 0;
const size = width * 0.1;

const PostGalleryScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={[styles.logoSection, { paddingTop: STATUSBAR_HEIGHT }]}>
      <LogoIcon width={size} height={size} />
    </View>
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
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
          key={item.id}
          style={[
            styles.cardWrapper,
            { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
          ]}
        >
          <Post {...item} />
        </View>
      ))}
      <View style={{ height: height * 0.08 }} />
    </ScrollView>
    <TouchableOpacity style={styles.fab} onPress={() => navigate('article')}>
      <EditIcon width={28} height={28} />
    </TouchableOpacity>
    <Footer navigation={navigation} />
  </View>
);

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
    fontWeight: "400",
    textAlign: "center",
  },
  rightline: { height: 2, backgroundColor: "#487153", width: width * 0.6 },
  leftline: { height: 2, backgroundColor: "#487153", width: width * 0.35 },
  subtext: { fontSize: height * 0.02, color: "#487153", fontWeight: "400" },
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
