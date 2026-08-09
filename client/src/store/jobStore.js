import { create } from 'zustand';
import * as jobApi from '../services/jobApi';

const useJobStore = create((set, get) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,

  fetchPublishedJobs: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await jobApi.getPublishedJobs(filters);
      set({ jobs: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch jobs', 
        isLoading: false 
      });
    }
  },

  fetchCompanyJobs: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await jobApi.getCompanyJobs(companyId);
      set({ jobs: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch company jobs', 
        isLoading: false 
      });
    }
  },

  fetchJobById: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await jobApi.getJobById(jobId);
      set({ currentJob: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch job', 
        isLoading: false 
      });
      throw error;
    }
  },

  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await jobApi.createJob(jobData);
      set((state) => ({ 
        jobs: [response.data, ...state.jobs],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create job', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateJob: async (jobId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await jobApi.updateJob(jobId, updateData);
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === jobId ? response.data : j)),
        currentJob: state.currentJob?._id === jobId ? response.data : state.currentJob,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update job', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateJobStatus: async (jobId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await jobApi.updateJobStatus(jobId, status);
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === jobId ? response.data : j)),
        currentJob: state.currentJob?._id === jobId ? response.data : state.currentJob,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update job status', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      await jobApi.deleteJob(jobId);
      set((state) => ({
        jobs: state.jobs.filter((j) => j._id !== jobId),
        currentJob: state.currentJob?._id === jobId ? null : state.currentJob,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete job', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useJobStore;
