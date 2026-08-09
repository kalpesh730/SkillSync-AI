import api from './api';

export const aiApi = {
  getATSScore: (jobId) => api.get(`/ai/ats-score/${jobId}`),
  getSkillGap: (jobId) => api.get(`/ai/skill-gap/${jobId}`),
  getJobMatch: (jobId) => api.get(`/ai/job-match/${jobId}`),
  getCareerRecommendations: () => api.get('/ai/career-recommendations'),
};
