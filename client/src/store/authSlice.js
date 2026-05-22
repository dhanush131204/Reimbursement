import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const tokenFromStorage = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  token: tokenFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.token = action.payload.token;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
