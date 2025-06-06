// src/api/userApi.js

import api from './axios.js';

// 사용자 정보 조회 api GET /user
export const fetchUserInfo = async () => {
  const response = await api.get('/user');
  // 기존에 console.log(response); 가 있었다면, 굳이 지우지 않아도 되지만
  console.log("🔍 fetchUserInfo HTTP 응답 전체:", response);
  return response.data;  // .data를 반환하면, App.js에서 console.log(userData)로 볼 수 있음
};
