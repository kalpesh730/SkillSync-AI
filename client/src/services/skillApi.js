import api from './api.js';

export const skillApi = {
  getMySkills: () => api.get('/students/me/skills'),
  addSkill: (skillData) => api.post('/students/me/skills', skillData),
  updateSkill: (skillId, skillData) => api.put(`/skills/${skillId}`, skillData),
  deleteSkill: (skillId) => api.delete(`/skills/${skillId}`),
};
