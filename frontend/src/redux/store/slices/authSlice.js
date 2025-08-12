// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  userRole: null,
  isAuthenticated: false,
};

// Initialize user data if token exists
if (initialState.token) {
  try {
    const decoded = jwtDecode(initialState.token);
    initialState.user = decoded;
    initialState.userRole = decoded.role;
    initialState.isAuthenticated = true;
  } catch (error) {
    // Token is invalid, clear it
    localStorage.removeItem('token');
    initialState.token = null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const token  = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      
      try {
        const decoded = jwtDecode(token);
        state.user = decoded;
        state.userRole = decoded.role;
        
        // Persist to localStorage
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Invalid token:', error);
        // Reset state if token is invalid
        state.token = null;
        state.user = null;
        state.userRole = null;
        state.isAuthenticated = false;
      }
    },
    
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userRole = null;
      state.isAuthenticated = false;
      
      // Remove from localStorage
      localStorage.removeItem('token');
    },
    
    // Optional: For token refresh scenarios
    updateToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      
      try {
        const decoded = jwtDecode(token);
        state.user = decoded;
        state.userRole = decoded.role;
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }
});

export const { loginSuccess, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.userRole;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;