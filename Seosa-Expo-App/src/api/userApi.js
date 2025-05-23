import api from './axios.js';

// 사용자 정보 조회 api GET /user
export const fetchUserInfo = async () => {
  const response = await api.get('/user');
  return response.data;
};
