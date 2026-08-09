import api from './api';

export const analyticsApi = {
  getStudentAnalytics: () => api.get('/analytics/student'),
  getCompanyAnalytics: () => api.get('/analytics/company'),
  getTenantAnalytics: () => api.get('/analytics/tenant'),
};
