/**
 * src/api/axios.js
 */
import axios from "axios";
import {
  getRefreshToken,
  setRefreshToken,
} from "../utils/tokenStorage";
import { store } from "../store/store";
import { setAccessToken } from "../store/authSlice";
import { Alert } from "react-native";
import { logout } from "../utils/logout";             // ← 공통 로그아웃

/* Axios 인스턴스 */
const api = axios.create({
  baseURL: "https://seosa.o-r.kr",
  timeout: 10000,
});

/* ─── 요청 인터셉터 ─── */
api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) return config;
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ─── 응답 인터셉터 ─── */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.data) console.error(err.response.data);

    const original = err.config;

    /* 첫 401 → 토큰 재발급 */
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const { data } = await axios.post(
          "https://seosa.o-r.kr/reissue",
          { refreshToken },
          { skipAuth: true }
        );
        await setRefreshToken(data.refreshToken);
        store.dispatch(setAccessToken(data.accessToken));
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (reissueError) {
        Alert.alert("인증 만료", "다시 로그인해주세요.", [
          { text: "확인", onPress: () => logout() },   // ← 공통 로그아웃
        ]);
        return Promise.reject(reissueError);
      }
    }

    /* 재발급 후에도 401 → 즉시 로그아웃 */
    if (err.response?.status === 401 && original._retry) {
      Alert.alert("인증 만료", "다시 로그인해주세요.", [
        { text: "확인", onPress: () => logout() },     // ← 공통 로그아웃
      ]);
    }

    return Promise.reject(err);
  }
);

export default api;
