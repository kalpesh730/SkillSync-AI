import { create } from 'zustand';
import { projectApi } from '../services/projectApi.js';

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectApi.getMyProjects();
      set({ projects: data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load projects', isLoading: false });
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectApi.createProject(projectData);
      set((state) => ({ 
        projects: [data.data, ...state.projects],
        isLoading: false 
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create project', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateProject: async (projectId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await projectApi.updateProject(projectId, updateData);
      set((state) => ({
        projects: state.projects.map(item => item._id === projectId ? data.data : item),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update project', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      await projectApi.deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter(item => item._id !== projectId),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete project', isLoading: false });
      return { success: false, error: error.response?.data?.message };
    }
  }
}));
