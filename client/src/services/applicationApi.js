import api from './api';

export const applicationApi = {
  applyToJob: (applicationData) => api.post('/applications', applicationData),
  
  getMyApplications: () => api.get('/applications/me'),
  
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  
  getCompanyApplications: (companyId) => api.get(`/applications/company/${companyId}`),
  
  getApplication: (applicationId) => api.get(`/applications/${applicationId}`),
  
  updateApplicationStatus: (applicationId, statusData) => 
    api.patch(`/applications/${applicationId}/status`, statusData),
    
  updateRecruiterNotes: (applicationId, notesData) => 
    api.patch(`/applications/${applicationId}/notes`, notesData),
};
