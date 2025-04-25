// 프로필 변경 화면

import React, { useState } from "react";
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import AuthHeader from "../../components/auth/AuthHeader";
import EditBtn from "../../icons/edit-yellow.svg";
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import ButtonComponent from "../../components/common/button/ButtonComponent";
import AlbumIcon from "../../icons/album.svg";
import CameraIcon from "../../icons/camera.svg";
import TrashcanIcon from "../../icons/trashcan.svg";

const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : StatusBar.currentHeight;

const EditProfileScreen = ({ navigation }) => {
  const size = Dimensions.get("window").width * 0.067;
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 상태

  const handleBack = () => {
    navigation.goBack();
  };

  // ✅ 갤러리에서 이미지 선택하는 함수
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("갤러리 접근 권한이 필요합니다.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // 정사각형으로 자르기
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="내 정보 수정하기" backOnPress={handleBack} />

      {/* 프로필 이미지 & 편집 버튼 */}
      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.image} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.editbtn} onPress={pickImage}>
            <EditBtn width={(size * 8) / 12} height={(size * 8) / 12} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 입력 필드 & 경고 메시지 */}
      <View style={styles.formContainer}>
        <ShortInputComponent title="닉네임" placeholder="닉네임을 입력하세요." description="중복확인" onChangeText="확인완료"/>
        <AlertComponent description="에러메세지 예시" />
      </View>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <ButtonComponent btnType="btn-green" description="수정 완료"/>
      </View>
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFB",
    alignItems: "center",
  },
  profileContainer: {
    height: height * 0.16625,
    width: width,
    alignItems: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.05,
  },
  profile: {
    height: height * 0.16625,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    borderRadius: 100,
    overflow: "hidden",
  },
  image: {
    height: height * 0.16625,
    width: height * 0.16625,
    backgroundColor: "#CCCCCC",
    borderRadius: 100,
  },
  editbtn: {
    position: "absolute",
    right: 5,
    bottom: 0,
    height: height * 0.0375,
    width: height * 0.0375,
    backgroundColor: "#487153",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    flex: 1, // 입력 폼이 확장될 수 있도록 설정
  },
  buttonContainer: {
    position: "absolute",
    bottom: height * 0.05, // 화면 하단에서 5% 위에 위치
    width: "90%",
  },
});

export default EditProfileScreen;
