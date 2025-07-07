import api from './axios';
import { store } from '../store/store';
import { setUser } from '../store/authSlice';

export const fetchUserInfo = async () => {
  const response = await api.get('/user');
  console.log("🔍 fetchUserInfo HTTP data", response.data);
  store.dispatch(setUser(response.data));
  return response.data;
};
