import api from './api.js';

export const projectApi = {
  getMyProjects: async () => {
    const response = await api.get('/students/me/projects');
    return response.data;
  },
  getStudentProjects: async (studentId) => {
    const response = await api.get(`/students/${studentId}/projects`);
    return response.data;
  },
  createProject: async (data) => {
    const response = await api.post('/students/me/projects', data);
    return response.data;
  },
  updateProject: async (projectId, data) => {
    const response = await api.put(`/projects/${projectId}`, data);
    return response.data;
  },
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};
