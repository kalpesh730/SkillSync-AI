import { create } from 'zustand';
import { studentApi } from '../services/studentApi.js';

export const useStudentStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await studentApi.getProfile();
      set({ profile: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load profile', loading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const data = await studentApi.updateProfile(profileData);
      set({ profile: data.data, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update profile', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateAvatar: async (base64Image) => {
    set({ loading: true, error: null });
    try {
      const data = await studentApi.updateAvatar(base64Image);
      set({ profile: data.data, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update avatar', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  }
}));
