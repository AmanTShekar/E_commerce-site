import { createSlice } from '@reduxjs/toolkit';

const storedAuth = JSON.parse(localStorage.getItem('auth'));

const initialState = storedAuth || {
  isLoggedIn: false,
  user: null,
  userType: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.userType = action.payload.userType;

      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.userType = null;

      // Clear localStorage
      localStorage.removeItem('auth');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
