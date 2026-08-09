import api from './api';

export const getPublishedJobs = async (filters) => {
  const response = await api.get('/jobs/published', { params: filters });
  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

export const getCompanyJobs = async (companyId) => {
  const response = await api.get(`/jobs/company/${companyId}`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (jobId, updateData) => {
  const response = await api.put(`/jobs/${jobId}`, updateData);
  return response.data;
};

export const updateJobStatus = async (jobId, status) => {
  const response = await api.patch(`/jobs/${jobId}/status`, { status });
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`);
  return response.data;
};
