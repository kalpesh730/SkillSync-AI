import { create } from 'zustand';
import api from '../services/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true, // initial load state for checking session

  // Actions
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, accessToken } = response.data.data;
      set({ user, accessToken, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, accessToken } = response.data.data;
      set({ user, accessToken, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  },

  logout: async (localOnly = false) => {
    if (!localOnly) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout failed on server', error);
      }
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  refreshSession: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      const { accessToken } = response.data.data;
      set({ accessToken });
      return accessToken;
    } catch (error) {
      set({ user: null, accessToken: null, isAuthenticated: false, loading: false });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      // First try to refresh the token to ensure we have a valid one if starting fresh
      await get().refreshSession();
      
      const response = await api.get('/auth/me');
      set({ user: response.data.data, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ user: null, accessToken: null, isAuthenticated: false, loading: false });
    }
  }
}));
