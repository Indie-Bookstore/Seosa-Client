// Expo SecureStore로 refresh token 저장, 조회, 삭제하는 util 함수

import * as SecureStore from 'expo-secure-store';

export const setRefreshToken = async (token) => {
  await SecureStore.setItemAsync('refreshToken', token);
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

export const removeRefreshToken = async () => {
  await SecureStore.deleteItemAsync('refreshToken');
};
