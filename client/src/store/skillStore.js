import { create } from 'zustand';
import { skillApi } from '../services/skillApi.js';

export const useSkillStore = create((set) => ({
  skillList: [],
  loading: false,
  error: null,

  fetchMySkills: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await skillApi.getMySkills();
      // Handle backend returning { success: true, data: [...] }
      set({ skillList: data.data || data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch skills', loading: false });
    }
  },

  addSkill: async (skillData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await skillApi.addSkill(skillData);
      const newSkill = data.data || data;
      set((state) => ({ 
        skillList: [...state.skillList, newSkill],
        loading: false 
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create skill', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateSkill: async (skillId, updateData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await skillApi.updateSkill(skillId, updateData);
      const updatedSkill = data.data || data;
      set((state) => ({
        skillList: state.skillList.map(item => item._id === skillId ? updatedSkill : item),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update skill', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteSkill: async (skillId) => {
    set({ loading: true, error: null });
    try {
      await skillApi.deleteSkill(skillId);
      set((state) => ({
        skillList: state.skillList.filter(item => item._id !== skillId),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete skill', loading: false });
      return { success: false, error: error.response?.data?.message };
    }
  },

  clearError: () => set({ error: null })
}));
