import { create } from 'zustand';
import { applicationApi } from '../services/applicationApi';

const useApplicationStore = create((set, get) => ({
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,

  fetchMyApplications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.getMyApplications();
      set({ applications: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch applications', loading: false });
    }
  },

  fetchJobApplications: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.getJobApplications(jobId);
      set({ applications: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch job applications', loading: false });
    }
  },

  fetchCompanyApplications: async (companyId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.getCompanyApplications(companyId);
      set({ applications: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch company applications', loading: false });
    }
  },

  getApplication: async (applicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.getApplication(applicationId);
      set({ currentApplication: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch application', loading: false });
      return null;
    }
  },

  applyToJob: async (applicationData) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.applyToJob(applicationData);
      set((state) => ({ 
        applications: [response.data.data, ...state.applications],
        loading: false 
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit application';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  withdrawApplication: async (applicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.updateApplicationStatus(applicationId, { status: 'WITHDRAWN' });
      set((state) => ({
        applications: state.applications.map((app) => 
          app._id === applicationId ? response.data.data : app
        ),
        currentApplication: state.currentApplication?._id === applicationId 
          ? response.data.data 
          : state.currentApplication,
        loading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to withdraw application';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.updateApplicationStatus(applicationId, { status });
      set((state) => ({
        applications: state.applications.map((app) => 
          app._id === applicationId ? response.data.data : app
        ),
        currentApplication: state.currentApplication?._id === applicationId 
          ? response.data.data 
          : state.currentApplication,
        loading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update application status';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateRecruiterNotes: async (applicationId, notes) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationApi.updateRecruiterNotes(applicationId, { notes });
      set((state) => ({
        applications: state.applications.map((app) => 
          app._id === applicationId ? response.data.data : app
        ),
        currentApplication: state.currentApplication?._id === applicationId 
          ? response.data.data 
          : state.currentApplication,
        loading: false
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update recruiter notes';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  clearError: () => set({ error: null })
}));

export { useApplicationStore };
