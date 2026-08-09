import { create } from 'zustand';
import * as companyApi from '../services/companyApi';

const useCompanyStore = create((set, get) => ({
  companies: [],
  currentCompany: null,
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await companyApi.getCompanies();
      set({ companies: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch companies', 
        isLoading: false 
      });
    }
  },

  fetchCompanyById: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await companyApi.getCompanyById(companyId);
      set({ currentCompany: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch company', 
        isLoading: false 
      });
      throw error;
    }
  },

  createCompany: async (companyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await companyApi.createCompany(companyData);
      set((state) => ({ 
        companies: [response.data, ...state.companies],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create company', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateCompany: async (companyId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await companyApi.updateCompany(companyId, updateData);
      set((state) => ({
        companies: state.companies.map((c) => (c._id === companyId ? response.data : c)),
        currentCompany: state.currentCompany?._id === companyId ? response.data : state.currentCompany,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update company', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteCompany: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
      await companyApi.deleteCompany(companyId);
      set((state) => ({
        companies: state.companies.filter((c) => c._id !== companyId),
        currentCompany: state.currentCompany?._id === companyId ? null : state.currentCompany,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete company', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCompanyStore;
