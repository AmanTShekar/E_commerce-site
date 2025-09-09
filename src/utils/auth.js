// utils/auth.js
import store from '../redux/store';
import { logout as logoutAction } from '../redux/reducer/authSlice';

// Get current user from localStorage (Redux also stores it there)
export const getUser = () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth?.user || null;
};

// Get current role ("admin" or "user")
export const getRole = () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  return auth?.userType || null;
};

// Logout function
export const logout = () => {
  // Update Redux store
  store.dispatch(logoutAction());

  // Clear localStorage and redirect to login
  window.location.href = '/login';
};
