import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import AuthHeader from "../../components/auth/AuthHeader";
import EditBtn from "../../icons/edit-yellow.svg";
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import ButtonComponent from "../../components/common/button/ButtonComponent";
import { goBack } from "../../utils/nav/RootNavigation";
import api from "../../api/axios";
import { fetchUserInfo } from "../../api/userApi";

import {
  S3_BUCKET,
  S3_REGION,
  COGNITO_POOL_ID,
  S3_PUBLIC_URL,
} from "../../config/aws";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const { width, height } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

/* ───── AWS S3 설정 ───── */
const s3 = new S3Client({
  region: S3_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: S3_REGION },
    identityPoolId: COGNITO_POOL_ID,
  }),
});
const uploadToS3 = async (uri, key) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Buffer.from(base64, "base64");
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );
  return S3_PUBLIC_URL(key);
};

export default function EditProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  /* 모든 훅 선언 */
  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* user 변경 시 초기값 반영 */
  useEffect(() => {
    if (user?.profileImage) setProfileImage(user.profileImage);
    if (user?.nickname) setNickname(user.nickname);
  }, [user]);

  /* ★ user 정보가 없으면 화면 자체를 제거 */
  if (!user) return null;

  const size = width * 0.067;

  /* 이미지 선택(로컬 URI만 저장) */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "갤러리 접근 권한을 허용해주세요.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!res.canceled && res.assets.length > 0) {
      setProfileImage(res.assets[0].uri);
    }
  };

  /* 닉네임 중복 확인 */
  const checkNickname = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setMsg("닉네임을 입력해주세요.");
      setMsgError(true);
      return;
    }
    try {
      setChecking(true);
      const { data } = await api.get(
        `/user/checkNickname?nickname=${encodeURIComponent(trimmed)}`
      );
      setMsg(data.message || "사용할 수 있는 닉네임입니다.");
      setMsgError(false);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "DUPLICATE_NICKNAME") {
        setMsg("이미 존재하는 닉네임입니다.");
        setMsgError(true);
      } else if (code === "VALIDATION_FAILED") {
        setMsg(err.response.data.message.replace("유효성 검사 실패: ", ""));
        setMsgError(true);
      } else {
        setMsg("닉네임 확인 중 오류가 발생했습니다.");
        setMsgError(true);
      }
    } finally {
      setChecking(false);
    }
  };

  /* 수정 완료 → S3 업로드 → PATCH → 최신 유저 정보 갱신 */
  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setMsg("닉네임을 입력해주세요.");
      setMsgError(true);
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = user.profileImage || "";
      if (profileImage?.startsWith("file://")) {
        const key = `profiles/${Date.now()}_${profileImage.split("/").pop()}`;
        imageUrl = await uploadToS3(profileImage, key);
      } else if (profileImage?.startsWith("http")) {
        imageUrl = profileImage;
      }

      await api.patch("/user/profile", {
        nickname: trimmed,
        profileImage: imageUrl,
      });

      /* 최신 정보 재조회 후 store 갱신 */
      try {
        const fresh = await fetchUserInfo();
        dispatch(setUser(fresh));
      } catch (e) {
        console.warn("⚠️  프로필 리프레시 실패:", e?.response?.data || e);
      }

      Alert.alert("완료", "프로필이 수정되었습니다.", [
        { text: "확인", onPress: goBack },
      ]);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "VALIDATION_FAILED") {
        Alert.alert(
          "실패",
          err.response.data.message.replace("유효성 검사 실패: ", "")
        );
      } else {
        Alert.alert("실패", err.response?.data?.message || err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* UI */
  return (
    <View style={styles.container}>
      <View style={{ height: STATUSBAR_HEIGHT }} />
      <AuthHeader title="내 정보 수정하기" backOnPress={goBack} />

      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.image} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.editbtn, { zIndex: 10, elevation: 10 }]}
          >
            <EditBtn width={size * 0.67} height={size * 0.67} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <ShortInputComponent
          title="닉네임"
          placeholder="닉네임을 입력하세요."
          value={nickname}
          onChangeText={(t) => {
            setNickname(t);
            setMsg("");
            setMsgError(false);
          }}
          onDuplicateCheck={checkNickname}
          description={checking ? "확인중…" : "중복확인"}
          duplicateBtnType={
            nickname.trim() && !checking ? "btn-green" : "btn-gray"
          }
          disabled={!nickname.trim() || checking}
        />
        {msg !== "" && <AlertComponent description={msg} isError={msgError} />}
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          btnType="btn-green"
          description={submitting ? "수정 중..." : "수정 완료"}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

/* ───── 스타일(변경 없음) ───── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFEFB", alignItems: "center" },
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
  imageContainer: { borderRadius: 100, overflow: "hidden" },
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
  formContainer: { width: "90%", flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: height * 0.05,
    width: "90%",
  },
});
