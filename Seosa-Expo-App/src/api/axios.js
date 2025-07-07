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

const api = axios.create({
  baseURL: "https://seosa.o-r.kr",
  timeout: 10_000,
});

/* ───── 요청 인터셉터: accessToken 주입 ───── */
api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) return config; // 인증이 필요 없는 요청
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/* ───── 응답 인터셉터: 401 처리 ───── */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    /* accessToken 만료 → refresh 시도 */
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const { data } = await axios.post(
          "https://seosa.o-r.kr/reissue",
          { refreshToken },
          { skipAuth: true },          // 이 요청은 토큰 불필요
        );

        /* 새 토큰 저장 */
        await saveAccessToken(data.accessToken);
        await setRefreshToken(data.refreshToken);
        store.dispatch(setReduxAccess(data.accessToken));
        store.dispatch(setReduxRefresh(data.refreshToken));

        /* 헤더 교체 후 원 요청 재시도 */
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (reissueError) {
        Alert.alert("인증 만료", "다시 로그인해주세요.", [
          { text: "확인", onPress: () => logout() },
        ]);
        return Promise.reject(reissueError);
      }
    }

    /* refresh 실패 or 재시도 후에도 401 */
    if (err.response?.status === 401) {
      Alert.alert("인증 만료", "다시 로그인해주세요.", [
        { text: "확인", onPress: () => logout() },
      ]);
    }

    return Promise.reject(err);
  },
);

export default api;
