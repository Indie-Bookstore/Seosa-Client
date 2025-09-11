import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import {
  setUser,
  setAccessToken as setReduxAccessToken,
  setIsTemporary,
} from "../../store/authSlice";
import { setRefreshToken as storeRefreshToken } from "../../utils/tokenStorage";
import { navigate } from "../../utils/nav/RootNavigation";
import SafeTopSpacer from "../../components/common/layout/SafeTopSpacer";

/* ───────── 공통 UI 컴포넌트 ───────── */
import AuthHeader from "../../components/auth/AuthHeader";
import ShortInputComponent from "../../components/common/input/ShortInputComponent";
import InfoInputComponent from "../../components/common/input/InfoInputComponent";
import AlertComponent from "../../components/auth/AlertComponent";
import ButtonComponent from "../../components/common/button/ButtonComponent";

const { height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  /* ───────── 입력 값 ───────── */
  const [nickname, setNickname] = useState("");
  const [authCode, setAuthCode] = useState("");

  /* ───────── UI/로딩 ───────── */
  const [loading, setLoading] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  /* ───────── 중복 확인/검증 상태 ───────── */
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [canCheckNickname, setCanCheckNickname] = useState(false);
  const [nicknameButtonText, setNicknameButtonText] = useState("중복확인");

  /* ───────── 에러 상태 ───────── */
  const [errors, setErrors] = useState({
    nickname: "",
    code: "",
    general: "",
  });

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  /* ───────── 뒤로가기 ───────── */
  const handleBack = () => {
    if (navigation?.goBack) navigation.goBack();
    else navigate("Home");
  };

  /* ───────── 닉네임 입력 ───────── */
  const handleNicknameChange = (text) => {
    setNickname(text);
    if (isNicknameVerified) {
      setIsNicknameVerified(false);
      setNicknameButtonText("중복확인");
    }
    setCanCheckNickname(text.trim().length >= 2);
    // 닉네임 오류 초기화
    setErrors((prev) => ({ ...prev, nickname: "" }));
  };

  /* ───────── 공통 API 에러 처리 ─────────
     서버에서 내려주는 { code, message }를 활용해 필드별 에러로 매핑
  */
  const handleApiError = (error, fieldFallback = "general") => {
    let code = "";
    let message = "알 수 없는 오류가 발생했습니다.";

    if (error?.response?.data) {
      code = error.response.data.code || "";
      message = error.response.data.message || message;
    }

    // 인증코드류 에러 추정 매핑(백엔드 사양에 맞춰 확장 가능)
    const isAuthCodeError =
      /ROLE|CODE|AUTH_CODE|INVALID.*CODE|WRONG.*CODE/i.test(code || "");

    // 필드 선택: 닉네임/코드/그 외
    const targetField = isAuthCodeError ? "code" : fieldFallback || "general";

    setErrors((prev) => ({ ...prev, [targetField]: message }));
  };

  /* ───────── 닉네임 중복 확인 ───────── */
  const handleNicknameCheck = async () => {
    if (!canCheckNickname) return;

    try {
      setIsCheckingNickname(true);
      await api.get(`/user/checkNickname`, {
        params: { nickname },
        skipAuth: true, // 공개 엔드포인트라면 유지. 인증이 필요하면 제거.
      });

      setErrors((prev) => ({ ...prev, nickname: "사용 가능한 닉네임입니다." }));
      setIsNicknameVerified(true);
      setNicknameButtonText("확인 완료");
      Alert.alert("알림", "사용 가능한 닉네임입니다.");
    } catch (error) {
      setIsNicknameVerified(false);
      handleApiError(error, "nickname");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  /* ───────── 추가 회원가입(온보딩 완료) ───────── */
  const handleSignup = async () => {
    // 닉네임 검증
    if (!nickname.trim()) {
      setErrors((prev) => ({ ...prev, nickname: "닉네임을 입력해주세요." }));
      return;
    }
    if (!isNicknameVerified) {
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임 중복 확인을 완료해주세요.",
      }));
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", code: "" }));

    try {
      // 추가 회원가입
      const response = await api.patch("/oauth2/signup", {
        nickname,
        userRoleCode: authCode, // 선택 입력
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data || {};

      // 새 토큰 저장
      if (newRefreshToken) await storeRefreshToken(newRefreshToken);
      if (newAccessToken) dispatch(setReduxAccessToken(newAccessToken));

      // 최신 유저 정보 조회
      const userRes = await api.get("/user");
      const updatedUser = userRes.data;

      dispatch(setUser(updatedUser));
      dispatch(setIsTemporary(false));

      // 온보딩 완료 → 마이스페이스
      navigate("MySpace");
    } catch (error) {
      // 인증코드 오류 등 필드별로 AlertComponent에 노출
      handleApiError(error, "general");
    } finally {
      setLoading(false);
    }
  };

  const isAllValid = isNicknameVerified; // 온보딩 요구사항상 닉네임 검증만 필수

  return (
    <View style={styles.container}>
      <SafeTopSpacer />
      <AuthHeader title="사용자 정보 입력" backOnPress={handleBack} />

      {/* 닉네임 */}
      <ShortInputComponent
        title="닉네임"
        placeholder="닉네임을 입력하세요."
        onChangeText={handleNicknameChange}
        value={nickname}
        required
        backgroundColor="white"
        onDuplicateCheck={handleNicknameCheck}
        description={nicknameButtonText}
        duplicateBtnType={
          isNicknameVerified
            ? "btn-gray"
            : canCheckNickname
            ? "btn-green"
            : "btn-gray"
        }
        disabled={isCheckingNickname || !canCheckNickname || isNicknameVerified}
      />
      <AlertComponent
        description={errors.nickname}
        isError={!isNicknameVerified || /중복|사용 불가/.test(errors.nickname)}
      />

      {/* 인증번호(선택) */}
      <InfoInputComponent
        title="인증번호(선택)"
        placeholder="인증번호 입력"
        value={authCode}
        onChangeText={(t) => {
          setAuthCode(t);
          // 코드 에러 초기화
          setErrors((prev) => ({ ...prev, code: "" }));
        }}
      />
      <AlertComponent description={errors.code} />

      {/* 일반 에러(네트워크/서버 등) */}
      <AlertComponent description={errors.general} />

      {/* 하단 버튼 */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#487153"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.buttonWrapper}>
          <ButtonComponent
            btnType={isAllValid ? "btn-green" : "btn-gray"}
            onPress={handleSignup}
            description="회원가입 완료"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFB",
    paddingHorizontal: "5%",
    paddingTop: height * 0.02,
    alignItems:"center"
  },
  header: {
    fontSize: height * 0.03,
    marginBottom: height * 0.02,
    fontFamily: "NotoSansRegular",
  },
  buttonWrapper: {
    marginTop: height * 0.03,
  },
});

export default OnboardingScreen;
