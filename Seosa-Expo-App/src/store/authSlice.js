// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    user: null,
    isTemporary: false,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsTemporary: (state, action) => {
      state.isTemporary = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isTemporary = false;
    },
  },
});

export const { setAccessToken, setRefreshToken, setUser, setIsTemporary, clearAuth } = authSlice.actions;
export default authSlice.reducer;
