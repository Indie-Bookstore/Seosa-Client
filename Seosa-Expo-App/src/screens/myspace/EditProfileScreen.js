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
import * as ImageManipulator from "expo-image-manipulator";
import { File } from "expo-file-system";            // ✅ 신규 FS API
import { fetch as expoFetch } from "expo/fetch";     // ✅ 권장 fetch
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
import { ensureUserAndToken } from "../../utils/ensureUserAndToken";
import { store } from "../../store/store";
import SafeTopSpacer from "../../components/common/layout/SafeTopSpacer";

const { width, height } = Dimensions.get("window");

/* ───── 업로드 관련 상수 ───── */
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp"];

/* ───── S3 업로드 (SDK 54 방식) ───── */
const uploadToS3 = async (uri) => {
  await ensureUserAndToken();
  const token = store.getState().auth.accessToken;

  // 확장자 & HEIC 변환
  let ext = (uri.split(".").pop() || "").toLowerCase();
  if (ext === "heic" || ext === "heif") {
    const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    uri = manipulated.uri;
    ext = "jpg";
  }
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error("PNG, JPG, JPEG, GIF, WEBP 형식만 지원합니다.");
  }

  // presigned URL
  const fileName = `profiles_${Date.now()}.${ext}`;
  const { data } = await api.get(
    `/s3/presigned/${encodeURIComponent(fileName)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const presignedUrl = data.url;
  const mime = `image/${ext === "jpg" ? "jpeg" : ext}`;

  // ✅ expo/fetch + File 로 업로드 (base64/Buffer 제거)
  const file = new File({ uri, name: fileName, type: mime });
  const res = await expoFetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": mime },
    body: file,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`S3 업로드 실패: ${res.status} ${txt}`);
  }

  // 정적 URL 반환
  return presignedUrl.split("?")[0];
};

export default function EditProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [profileImage, setProfileImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.profileImage) setProfileImage(user.profileImage);
    if (user?.nickname) setNickname(user.nickname);
  }, [user]);

  if (!user) return null;

  const size = width * 0.067;

  /* ───── 이미지 선택 ───── */
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "갤러리 접근 권한을 허용해주세요.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],      // ✅ SDK 54
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!res.canceled && res.assets.length > 0) {
        setProfileImage(res.assets[0].uri);
      }
    } catch (e) {
      console.error("이미지 선택 오류:", e);
      Alert.alert("오류", "이미지를 불러오지 못했습니다.");
    }
  };

  /* ───── 닉네임 중복 확인 ───── */
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

  /* ───── 프로필 수정 제출 ───── */
  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setMsg("닉네임을 입력해주세요.");
      setMsgError(true);
      return;
    }

    setSubmitting(true);
    try {
      // 1) 이미지 업로드 (필요 시)
      let imageUrl = user.profileImage || "";
      if (profileImage?.startsWith("file://")) {
        imageUrl = await uploadToS3(profileImage);
      } else if (profileImage?.startsWith("http")) {
        imageUrl = profileImage;
      }

      // 2) PATCH /user/profile
      await api.patch("/user/profile", {
        nickname: trimmed,
        profileImage: imageUrl,
      });

      // 3) 최신 유저 정보 로드
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
      if (err.message.includes("지원합니다")) {
        Alert.alert("실패", err.message);
      } else {
        const code = err.response?.data?.code;
        if (code === "VALIDATION_FAILED") {
          Alert.alert(
            "실패",
            err.response.data.message.replace("유효성 검사 실패: ", "")
          );
        } else {
          Alert.alert("실패", err.response?.data?.message || err.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ───── UI ───── */
  return (
    <View style={styles.container}>
      <SafeTopSpacer />
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
