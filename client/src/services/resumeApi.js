import api from './api.js';

export const resumeApi = {
  uploadResume: async (data) => {
    const response = await api.post('/students/me/resumes', data);
    return response.data;
  },
  getMyResumes: async () => {
    const response = await api.get('/students/me/resumes');
    return response.data;
  },
  getResume: async (studentId) => {
    // Note: To get student resumes for recruiter/admin
    const response = await api.get(`/students/${studentId}/resumes`);
    return response.data;
  },
  updateResume: async (resumeId, data) => {
    const response = await api.put(`/resumes/${resumeId}`, data);
    return response.data;
  },
  setPrimaryResume: async (resumeId) => {
    const response = await api.put(`/resumes/${resumeId}`, { isPrimary: true });
    return response.data;
  },
  deleteResume: async (resumeId) => {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  },
  retryParsing: async (resumeId) => {
    const response = await api.post(`/resumes/${resumeId}/parse`);
    return response.data;
  }
};
