import { create } from 'zustand';
import { educationApi } from '../services/educationApi.js';

export const useEducationStore = create((set, get) => ({
  educationList: [],
  loading: false,
  error: null,

  fetchMyEducation: async () => {
    set({ loading: true, error: null });
    try {
      const data = await educationApi.getMyEducation();
      set({ educationList: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load education', loading: false });
    }
  },

  addEducation: async (educationData) => {
    set({ loading: true, error: null });
    try {
      const data = await educationApi.addEducation(educationData);
      set((state) => ({ 
        educationList: [data.data, ...state.educationList],
        loading: false 
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add education', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateEducation: async (educationId, updateData) => {
    set({ loading: true, error: null });
    try {
      const data = await educationApi.updateEducation(educationId, updateData);
      set((state) => ({
        educationList: state.educationList.map(item => item._id === educationId ? data.data : item),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update education', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteEducation: async (educationId) => {
    set({ loading: true, error: null });
    try {
      await educationApi.deleteEducation(educationId);
      set((state) => ({
        educationList: state.educationList.filter(item => item._id !== educationId),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete education', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  }
}));
