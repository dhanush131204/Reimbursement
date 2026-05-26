import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const storedToken = localStorage.getItem('token');
const tokenFromStorage = storedToken && storedToken !== 'undefined' && storedToken !== 'null'
  ? storedToken
  : null;

if (!tokenFromStorage) {
  localStorage.removeItem('token');
}

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
      state.token = action.payload.token || null;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      } else {
        localStorage.removeItem('token');
      }
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
