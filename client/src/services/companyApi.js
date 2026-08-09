import api from './api';

export const getCompanies = async () => {
  const response = await api.get('/companies');
  return response.data;
};

export const getCompanyById = async (companyId) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await api.post('/companies', companyData);
  return response.data;
};

export const updateCompany = async (companyId, updateData) => {
  const response = await api.put(`/companies/${companyId}`, updateData);
  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await api.delete(`/companies/${companyId}`);
  return response.data;
};
