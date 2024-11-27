// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage
const loadUserFromLocalStorage = () => {
  const savedUser = localStorage.getItem('userData');
  return savedUser ? JSON.parse(savedUser) : null;
};

const saveUserToLocalStorage = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

const clearUserFromLocalStorage = () => {
  localStorage.removeItem('userData');
};

// Helper functions for admin data in localStorage
const loadAdminFromLocalStorage = () => {
  const savedAdmin = localStorage.getItem('adminData');
  return savedAdmin ? JSON.parse(savedAdmin) : null;
};

const saveAdminToLocalStorage = (adminData) => {
  localStorage.setItem('adminData', JSON.stringify(adminData));
};

// Helper functions for admin task data in localStorage
const loadAdminTaskFromLocalStorage = () => {
  const savedAdminTaskData = localStorage.getItem('adminTaskData');
  return savedAdminTaskData ? JSON.parse(savedAdminTaskData) : null;
};

const saveAdminTaskToLocalStorage = (adminTaskData) => {
  localStorage.setItem('adminTaskData', JSON.stringify(adminTaskData));
};

// Helper functions for admin users data in localStorage
const loadAdminUsersFromLocalStorage = () => {
  const savedAdminUser = localStorage.getItem('adminUserData');
  return savedAdminUser ? JSON.parse(savedAdminUser) : null;
};

const saveAdminUsersToLocalStorage = (adminUserData) => {
  localStorage.setItem('adminUserData', JSON.stringify(adminUserData));
};

const clearAdminFromLocalStorage = () => {
  localStorage.removeItem('adminData');
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: loadUserFromLocalStorage(), // Load user from localStorage
    access_token: localStorage.getItem('access_token') || null,
    adminData: loadAdminFromLocalStorage(), // Load admin from localStorage
    adminTaskData: loadAdminTaskFromLocalStorage(), // Load admin from localStorage
    adminUserData: loadAdminUsersFromLocalStorage(), // Load admin from localStorage
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
      saveUserToLocalStorage(action.payload); // Save user to localStorage
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
      localStorage.setItem('access_token', action.payload); // Save token to localStorage
    },
    clearUser: (state) => {
      state.userData = null;
      clearUserFromLocalStorage(); // Clear user from localStorage
    },
    clearAccessToken: (state) => {
      state.access_token = null;
      localStorage.removeItem('access_token'); // Clear token from localStorage
    },
    setAdmin: (state, action) => {
      state.adminData = action.payload;
      saveAdminToLocalStorage(action.payload); // Save admin to localStorage
    },
    setAdminTask: (state, action) => {
      state.adminTaskData = action.payload;
      saveAdminTaskToLocalStorage(action.payload); // Save admin to localStorage
    },
    setAdminUser: (state, action) => {
      state.adminUserData = action.payload;
      saveAdminUsersToLocalStorage(action.payload); // Save admin to localStorage
    },
    clearAdmin: (state) => {
      state.adminData = null;
      clearAdminFromLocalStorage(); // Clear admin from localStorage
    },
  },
});

export const { setUser, clearUser, setAccessToken, clearAccessToken, setAdmin, clearAdmin,setAdminTask,setAdminUser } = userSlice.actions;
export default userSlice.reducer;
