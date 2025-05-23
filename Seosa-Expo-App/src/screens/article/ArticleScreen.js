// src/screens/ArticleScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  StatusBar as RNStatusBar,
  DeviceEventEmitter,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

import ArticleHeader from "../../components/article/ArticleHeader";
import ArticleTitle from "../../components/article/ArticleTitle";
import ArticleEditor from "../../components/article/ArticleEditor";
import ArticleItemList from "../../components/article/ArticleItemList";
import ArticleInfo from "../../components/article/ArticleInfo";
import AlbumIcon from "../../icons/album-green.svg";

const { width, height } = Dimensions.get("window");
const DEFAULT_FAB_BOTTOM = height * 0.09;

export default function ArticleScreen({ navigation }) {
  const STATUSBAR_HEIGHT =
    Platform.OS === "ios"
      ? Constants.statusBarHeight
      : RNStatusBar.currentHeight || 0;

  const [blocks, setBlocks] = useState([{ type: "text", value: "" }]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [narratives, setNarratives] = useState([{ title: "", author: "", review: "" }]);
  const [storeInfo, setStoreInfo] = useState({
    address: "",
    coords: null,
    openDays: "",
    phoneNumber: "",
    instagramLink: "",
  });

  // 글쓰기 취소 확인
  const handleCancel = () => {
    Alert.alert(
      "글쓰기 취소",
      "정말 글쓰기를 그만두시겠습니까?",
      [
        { text: "아니요", style: "cancel" },
        { text: "예", style: "destructive", onPress: () => navigation.goBack() },
      ]
    );
  };

  // 서사 모아보기 핸들러
  const handleAddNarrative = () => {
    if (narratives.length < 5) {
      setNarratives([...narratives, { title: "", author: "", review: "" }]);
    }
  };
  const handleChangeItem = (idx, newItem) => {
    const arr = [...narratives];
    arr[idx] = newItem;
    setNarratives(arr);
  };
  const handleRemoveItem = idx => {
    setNarratives(narratives.filter((_, i) => i !== idx));
  };

  // 지도 선택 이벤트
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("mapSelect", ({ address, coords }) => {
      setStoreInfo(prev => ({ ...prev, address, coords }));
    });
    return () => sub.remove();
  }, []);

  // 키보드 높이 처리
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", e => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0));
    return () => { show.remove(); hide.remove(); };
  }, []);

  // 이미지 추가
  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("갤러리 접근 권한 필요");
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes:["images"], allowsEditing:false, quality:1 });
    if (res.canceled) return;
    const uri = res.assets[0].uri;
    const idx = focusedIndex + 1;
    setBlocks(b => [
      ...b.slice(0, idx),
      { type: "image", value: uri },
      { type: "text", value: "" },
      ...b.slice(idx),
    ]);
    Keyboard.dismiss();
  };

  const onMapPress = () => navigation.navigate("MapPicker");

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <ArticleHeader onCancel={handleCancel} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ArticleTitle />
        <ArticleEditor blocks={blocks} setBlocks={setBlocks} setFocusedIndex={setFocusedIndex} />
        <ArticleItemList
          items={narratives}
          onAdd={handleAddNarrative}
          onChangeItem={handleChangeItem}
          onRemoveItem={handleRemoveItem}
        />
        <ArticleInfo info={storeInfo} onChange={setStoreInfo} onMapPress={onMapPress} />
      </ScrollView>
      <TouchableOpacity
        style={[styles.fab, { bottom: keyboardHeight > 0 ? keyboardHeight + 16 : DEFAULT_FAB_BOTTOM }]}
        onPress={handleAddImage}
      >
        <AlbumIcon width={28} height={28} />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFEFB" },
  scrollContainer: { paddingBottom: 40, alignItems: "center" },
  fab: {
    position: "absolute",
    right: 24,
    backgroundColor: "#E2E7E3",
    borderRadius: 28,
    width: height * 0.06,
    height: height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});