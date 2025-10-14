import axios from "axios";
import {
  getRefreshToken,
  setRefreshToken,
  setAccessToken as saveAccessToken,
} from "../utils/tokenStorage";
import { store } from "../store/store";
import {
  setAccessToken as setReduxAccess,
  setRefreshToken as setReduxRefresh,
} from "../store/authSlice";
import { Alert } from "react-native";
import { logout } from "../utils/logout";

/** 전역 axios 인스턴스 */
const api = axios.create({
  baseURL: "https://seosa.o-r.kr",
  timeout: 10_000,
});

/** 비즈니스 레벨 인증/검증 에러 코드(전역 Alert/리프레시 금지) */
const BUSINESS_AUTH_ERROR_CODES = new Set([
  "USER_NOT_FOUND",
  "INVALID_PASSWORD",
  "VALIDATION_FAILED",
  "INVALID_REQUEST",
]);

/** 인증 관련 엔드포인트: 전역에서 개입하지 않고 화면에서 처리 */
const AUTH_ENDPOINT_PATTERNS = [
  /\/local\/login\b/,
  /\/local\/register\b/,
  /\/login\/oauth2\/code\/kakao\b/,
  /\/reissue\b/, // 리프레시 자체 호출은 별도 분기
];

/** 유틸: 요청 URL이 인증 관련 엔드포인트인지 판단 */
function isAuthEndpoint(url = "") {
  return AUTH_ENDPOINT_PATTERNS.some((re) => re.test(url));
}

/** ───── 요청 인터셉터: accessToken 주입 ───── */
api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) return config; // 명시적으로 인증 건너뛰기
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/** ───── 응답 인터셉터: 401 처리 규칙 정교화 ───── */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // 네트워크 오류 등 응답 객체가 없는 경우는 그대로 throw
    if (!err.response) {
      return Promise.reject(err);
    }

    const { status, data } = err.response;
    const code = data?.code;
    const url = original?.url || "";

    // 1) 비즈니스 에러코드는 전역에서 건드리지 않고 화면 단 처리에 맡김
    if (BUSINESS_AUTH_ERROR_CODES.has(code)) {
      return Promise.reject(err);
    }

    // 2) 인증 관련 엔드포인트 자체는 전역에서 개입하지 않음 (로그인/회원가입 화면에서 처리)
    if (isAuthEndpoint(url)) {
      return Promise.reject(err);
    }

    // 3) accessToken 만료로 추정되는 401만 토큰 재발급 시도 (중복 방지)
    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          // 리프레시 토큰 없음 → 바로 만료 처리
          throw new Error("NO_REFRESH_TOKEN");
        }

        // 리프레시 요청은 인증 헤더 없이, 전역 인터셉터도 건너뛴다(skipAuth)
        const { data: reissue } = await axios.post(
          "https://seosa.o-r.kr/reissue",
          { refreshToken },
          { skipAuth: true },
        );

        // 새 토큰 저장
        await saveAccessToken(reissue.accessToken);
        await setRefreshToken(reissue.refreshToken);
        store.dispatch(setReduxAccess(reissue.accessToken));
        store.dispatch(setReduxRefresh(reissue.refreshToken));

        // 원 요청 헤더 교체 후 재시도
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${reissue.accessToken}`;
        return api(original);
      } catch (reissueError) {
        // 리프레시 실패 시에만 전역 만료 Alert + 로그아웃
        Alert.alert("인증 만료", "다시 로그인해주세요.", [
          { text: "확인", onPress: () => logout() },
        ]);
        return Promise.reject(reissueError);
      }
    }

    // 4) 그 외의 401 (권한 없음 등)도 전역 Alert로 처리하지 않고 그대로 throw
    return Promise.reject(err);
  },
);

export default api;
