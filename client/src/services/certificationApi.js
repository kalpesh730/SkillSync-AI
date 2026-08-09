import api from './api.js';

export const certificationApi = {
  getMyCertifications: async () => {
    const response = await api.get('/students/me/certifications');
    return response.data;
  },
  getStudentCertifications: async (studentId) => {
    const response = await api.get(`/students/${studentId}/certifications`);
    return response.data;
  },
  createCertification: async (data) => {
    const response = await api.post('/students/me/certifications', data);
    return response.data;
  },
  updateCertification: async (certificationId, data) => {
    const response = await api.put(`/certifications/${certificationId}`, data);
    return response.data;
  },
  deleteCertification: async (certificationId) => {
    const response = await api.delete(`/certifications/${certificationId}`);
    return response.data;
  }
};
