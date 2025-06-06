/**
 * src/api/axios.js
 */

import axios from 'axios';
import { getRefreshToken, setRefreshToken, removeRefreshToken, removeAccessToken } from '../utils/tokenStorage';
import { store } from '../store/store';
import { setAccessToken, clearAuth } from '../store/authSlice';
import { Alert } from 'react-native';
import { navigationRef } from '../utils/nav/RootNavigation'; // ← 네비게이션 참조

const api = axios.create({
  baseURL: 'https://seosa.o-r.kr',
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) return config;

    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1) 서버가 내려준 JSON이 있으면 항상 콘솔에 찍기
    if (error.response && error.response.data) {
      console.error(error.response.data);
    }

    const originalRequest = error.config;

    // 2) 첫 401 발생 시, _retry 플래그가 없으면 토큰 재발급 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        // 리프레시 토큰이 없거나 잘못된 경우 catch로 넘어감
        const response = await axios.post(
          'https://seosa.o-r.kr/reissue',
          { refreshToken },
          { skipAuth: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await setRefreshToken(newRefreshToken);
        store.dispatch(setAccessToken(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 시
        Alert.alert(
          '인증시간이 만료되어 자동으로 로그아웃됩니다.',
          '',
          [
            {
              text: '확인',
              onPress: () => {
                removeRefreshToken();
                removeAccessToken();
                store.dispatch(clearAuth());
                if (navigationRef.isReady()) {
                  navigationRef.navigate('Auth');
                }
              },
            },
          ],
          { cancelable: false }
        );
        return Promise.reject(refreshError);
      }
    }

    // 3) 이미 리프레시 시도 후에도 401인 경우 → 로그아웃 알림
    if (error.response?.status === 401 && originalRequest._retry) {
      Alert.alert(
        '인증시간이 만료되어 자동으로 로그아웃됩니다.',
        '',
        [
          {
            text: '확인',
            onPress: () => {
              removeRefreshToken();
              removeAccessToken();
              store.dispatch(clearAuth());
              if (navigationRef.isReady()) {
                navigationRef.navigate('Auth');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }

    // 4) 그 외의 에러는 그대로 reject
    return Promise.reject(error);
  }
);

export default api;
