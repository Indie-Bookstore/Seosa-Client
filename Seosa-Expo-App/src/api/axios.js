/**
 * src/api/axios.js
 */

import axios from 'axios';
import { getRefreshToken, setRefreshToken, removeRefreshToken } from '../utils/tokenStorage';
import { store } from '../store/store';
import { setAccessToken, clearAuth } from '../store/authSlice';

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
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await getRefreshToken();
        const response = await axios.post(
          'https://seosa.o-r.kr/refresh-token',
          { refreshToken },
          { skipAuth: true }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await setRefreshToken(newRefreshToken);
        store.dispatch(setAccessToken(accessToken));
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
