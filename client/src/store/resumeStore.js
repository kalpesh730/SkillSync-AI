import { create } from 'zustand';
import { resumeApi } from '../services/resumeApi.js';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  isLoading: false,
  error: null,

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await resumeApi.getMyResumes();
      set({ resumes: data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load resumes', isLoading: false });
    }
  },

  uploadResume: async (uploadData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await resumeApi.uploadResume(uploadData);
      set((state) => {
        let newResumes = [...state.resumes];
        if (uploadData.isPrimary) {
          newResumes = newResumes.map(r => ({ ...r, isPrimary: false }));
        }
        return { resumes: [data.data, ...newResumes], isLoading: false };
      });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to upload resume', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchResume: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await resumeApi.getResume(studentId);
      set({ resumes: data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load student resumes', isLoading: false });
    }
  },

  updateResume: async (resumeId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await resumeApi.updateResume(resumeId, updateData);
      
      // If we made a resume primary, all other resumes are no longer primary
      if (updateData.isPrimary) {
        set((state) => ({
          resumes: state.resumes.map(item => ({
            ...item,
            isPrimary: item._id === resumeId ? true : false
          })),
          isLoading: false
        }));
      } else {
        set((state) => ({
          resumes: state.resumes.map(item => item._id === resumeId ? data.data : item),
          isLoading: false
        }));
      }
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update resume', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  setPrimaryResume: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      await resumeApi.setPrimaryResume(resumeId);
      // Optimistically update the primary status
      set((state) => ({
        resumes: state.resumes.map(item => ({
          ...item,
          isPrimary: item._id === resumeId ? true : false
        })),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to set primary resume', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteResume: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      await resumeApi.deleteResume(resumeId);
      // Fetch resumes again to get the updated list and new fallback primary
      const data = await resumeApi.getMyResumes();
      set({ resumes: data.data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete resume', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  retryParsing: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await resumeApi.retryParsing(resumeId);
      set((state) => ({
        resumes: state.resumes.map(item => item._id === resumeId ? data.data : item),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to retry parsing', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  clearError: () => set({ error: null })
}));
