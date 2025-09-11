import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import * as Clipboard from 'expo-clipboard';
import BackButtonComponent from "../common/button/BackButtonComponent";
import DotBtn from "../../icons/dot.svg";

const { width, height } = Dimensions.get("window");

const PostHeader = ({
  title,
  postId,               
  onBackPress,
  onDeletePress,
  canDelete = false,
}) => {
  const iconSize = width * 0.067;
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(prev => !prev);

  /* ───── URL 복사 ───── */
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

  /* ───── 삭제 ───── */
  const handleDelete = () => {
    Alert.alert(
      "알림",
      "정말 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel", onPress: () => setMenuVisible(false) },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            setMenuVisible(false);
            await onDeletePress?.();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.headerContainer}>
      {/* 메뉴 외 영역 터치 시 닫기 */}
      {menuVisible && (
        <Pressable
          style={styles.overlay}
          onPress={toggleMenu}
        />
      )}

      <BackButtonComponent onPress={onBackPress} theme="green" />
      <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      <TouchableOpacity onPress={toggleMenu} style={styles.dotButton}>
        <DotBtn width={iconSize} height={iconSize} />
      </TouchableOpacity>

      {menuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleCopyUrl}>
            <Text style={styles.menuText}>URL 복사하기</Text>
          </TouchableOpacity>

          {canDelete && (
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={[styles.menuText, styles.logoutText]}>글 삭제하기</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#487153",
    height: height * 0.07,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    justifyContent: "space-between",
    position: "relative",
    zIndex: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: width * 0.067,
    fontWeight: "bold",
    fontFamily: "UnBatangBold",
    marginLeft: width * 0.04,
    flex: 1,
  },
  dotButton: {
    paddingLeft: 12,
    paddingVertical: 4,
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
    zIndex: 20,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
    fontFamily:"NotoSansRegular"
  },
  logoutText: {
    color: "#FF3333",
    fontWeight: "bold",
    fontFamily:"NotoSansBold"
  },
});

export default PostHeader;
