// src/api/api.js
import axios from 'axios';
import { getRefreshToken, setRefreshToken, removeRefreshToken } from '../utils/tokenStorage';
import { store } from '../store/store';
import { setAccessToken, clearAuth } from '../store/authSlice';

const api = axios.create({
  baseURL: 'https://seosa.o-r.kr', // 백엔드 테스트 서버 주소
  timeout: 10000,
});

// 요청 인터셉터: 저장된 access token을 헤더에 포함
api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 시 refresh token으로 access token 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        // refresh token 엔드포인트도 seosa 서버 주소 사용
        const response = await axios.post('https://seosa.o-r.kr/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await setRefreshToken(newRefreshToken);
        store.dispatch(setAccessToken(accessToken));
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await removeRefreshToken();
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
