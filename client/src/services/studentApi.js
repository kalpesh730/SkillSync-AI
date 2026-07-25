import api from './api.js';

export const studentApi = {
  getProfile: async () => {
    const response = await api.get('/students/me');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/students/me', data);
    return response.data;
  },
  updateAvatar: async (base64String) => {
    const response = await api.patch('/students/me/avatar', { profilePhoto: base64String });
    return response.data;
  },
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  getAllStudents: async (params) => {
    const response = await api.get('/students', { params });
    return response.data;
  },
};
