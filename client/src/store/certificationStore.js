import { create } from 'zustand';
import { certificationApi } from '../services/certificationApi.js';

export const useCertificationStore = create((set, get) => ({
  certifications: [],
  isLoading: false,
  error: null,

  fetchMyCertifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await certificationApi.getMyCertifications();
      set({ certifications: data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load certifications', isLoading: false });
    }
  },

  fetchStudentCertifications: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await certificationApi.getStudentCertifications(studentId);
      set({ certifications: data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load certifications', isLoading: false });
    }
  },

  createCertification: async (certificationData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await certificationApi.createCertification(certificationData);
      set((state) => ({ 
        certifications: [data.data, ...state.certifications],
        isLoading: false 
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create certification', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateCertification: async (certificationId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await certificationApi.updateCertification(certificationId, updateData);
      set((state) => ({
        certifications: state.certifications.map(item => item._id === certificationId ? data.data : item),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update certification', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteCertification: async (certificationId) => {
    set({ isLoading: true, error: null });
    try {
      await certificationApi.deleteCertification(certificationId);
      set((state) => ({
        certifications: state.certifications.filter(item => item._id !== certificationId),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete certification', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  clearError: () => set({ error: null })
}));
