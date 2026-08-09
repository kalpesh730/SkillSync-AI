import { create } from 'zustand';
import { aiApi } from '../services/aiApi';

export const useAIStore = create((set) => ({
  atsScore: null,
  skillGap: null,
  jobMatch: null,
  recommendations: null,
  
  loadingATS: false,
  loadingSkillGap: false,
  loadingJobMatch: false,
  loadingRecommendations: false,
  
  error: null,

  fetchATSScore: async (jobId) => {
    set({ loadingATS: true, error: null });
    try {
      const response = await aiApi.getATSScore(jobId);
      set({ atsScore: response.data.data, loadingATS: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch ATS score', loadingATS: false });
      return null;
    }
  },

  fetchSkillGap: async (jobId) => {
    set({ loadingSkillGap: true, error: null });
    try {
      const response = await aiApi.getSkillGap(jobId);
      set({ skillGap: response.data.data, loadingSkillGap: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch skill gap', loadingSkillGap: false });
      return null;
    }
  },

  fetchJobMatch: async (jobId) => {
    set({ loadingJobMatch: true, error: null });
    try {
      const response = await aiApi.getJobMatch(jobId);
      set({ jobMatch: response.data.data, loadingJobMatch: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch job match', loadingJobMatch: false });
      return null;
    }
  },

  fetchRecommendations: async () => {
    set({ loadingRecommendations: true, error: null });
    try {
      const response = await aiApi.getCareerRecommendations();
      set({ recommendations: response.data.data, loadingRecommendations: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch recommendations', loadingRecommendations: false });
      return null;
    }
  },

  clearError: () => set({ error: null })
}));
