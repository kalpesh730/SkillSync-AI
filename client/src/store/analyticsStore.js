import { create } from 'zustand';
import { analyticsApi } from '../services/analyticsApi';

export const useAnalyticsStore = create((set) => ({
  studentAnalytics: null,
  companyAnalytics: null,
  tenantAnalytics: null,
  
  loadingStudent: false,
  loadingCompany: false,
  loadingTenant: false,
  
  error: null,

  fetchStudentAnalytics: async () => {
    set({ loadingStudent: true, error: null });
    try {
      const response = await analyticsApi.getStudentAnalytics();
      set({ studentAnalytics: response.data.data, loadingStudent: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch student analytics', loadingStudent: false });
    }
  },

  fetchCompanyAnalytics: async () => {
    set({ loadingCompany: true, error: null });
    try {
      const response = await analyticsApi.getCompanyAnalytics();
      set({ companyAnalytics: response.data.data, loadingCompany: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch company analytics', loadingCompany: false });
    }
  },

  fetchTenantAnalytics: async () => {
    set({ loadingTenant: true, error: null });
    try {
      const response = await analyticsApi.getTenantAnalytics();
      set({ tenantAnalytics: response.data.data, loadingTenant: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch tenant analytics', loadingTenant: false });
    }
  }
}));
