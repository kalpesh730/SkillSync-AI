import api from './api.js';

export const educationApi = {
  getMyEducation: async () => {
    const response = await api.get('/students/me/education');
    return response.data;
  },
  getStudentEducation: async (studentId) => {
    const response = await api.get(`/students/${studentId}/education`);
    return response.data;
  },
  addEducation: async (data) => {
    const response = await api.post('/students/me/education', data);
    return response.data;
  },
  updateEducation: async (educationId, data) => {
    const response = await api.put(`/education/${educationId}`, data);
    return response.data;
  },
  deleteEducation: async (educationId) => {
    const response = await api.delete(`/education/${educationId}`);
    return response.data;
  }
};
