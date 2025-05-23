// screens/EditProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import AuthHeader from "../../components/auth/AuthHeader";
import EditBtn from "../../icons/edit-yellow.svg";
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import ButtonComponent from "../../components/common/button/ButtonComponent";
import { goBack } from "../../utils/nav/RootNavigation";

const { width, height } = Dimensions.get("window");
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? Constants.statusBarHeight : RNStatusBar.currentHeight;

const EditProfileScreen = () => {
  // Redux에서 user 정보 불러오기
  const user = useSelector((state) => state.auth.user);
  // profileImage state: 기존 user.profileImage 로 초기값 설정
  const [profileImage, setProfileImage] = useState(null);

  // user가 로드되거나 변경될 때마다 profileImage 설정
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user?.profileImage]);

  const size = width * 0.067;

  const handleBack = () => {
    goBack();
  };

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("갤러리 접근 권한이 필요합니다.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="내 정보 수정하기" backOnPress={handleBack} />

      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imageContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.image}
              />
            ) : (
              <View style={styles.image} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editbtn}
            onPress={pickImage}
          >
            <EditBtn
              width={size * 0.67}
              height={size * 0.67}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <ShortInputComponent
          title="닉네임"
          placeholder="닉네임을 입력하세요."
          description="중복확인"
          onChangeText={() => console.log("중복확인")}
        />
        <AlertComponent description="에러메세지 예시" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          btnType="btn-green"
          description="수정 완료"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFB",
    alignItems: "center",
  },
  profileContainer: {
    height: height * 0.16625,
    width,
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
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: height * 0.05,
    width: "90%",
  },
});

export default EditProfileScreen;
