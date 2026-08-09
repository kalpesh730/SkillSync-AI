import { ApplicationService } from '../services/application.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const applyToJob = async (req, res, next) => {
  try {
    const { tenantId, _id: studentId } = req.user;
    
    const application = await ApplicationService.applyToJob(tenantId, studentId, req.body);
    return apiResponse(res, HTTP_STATUS.CREATED, 'Application submitted successfully', application);
  } catch (error) {
    next(error);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { applicationId } = req.params;
    
    const application = await ApplicationService.getApplicationById(applicationId, tenantId, req.user);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, application);
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const { tenantId, _id: studentId } = req.user;
    
    const applications = await ApplicationService.getStudentApplications(studentId, tenantId, req.user);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, applications);
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { jobId } = req.params;
    
    const applications = await ApplicationService.getJobApplications(jobId, tenantId, req.user);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, applications);
  } catch (error) {
    next(error);
  }
};

export const getCompanyApplications = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { companyId } = req.params;
    
    const applications = await ApplicationService.getCompanyApplications(companyId, tenantId, req.user);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, applications);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const application = await ApplicationService.updateApplicationStatus(applicationId, tenantId, status, req.user);
    return apiResponse(res, HTTP_STATUS.OK, 'Application status updated successfully', application);
  } catch (error) {
    next(error);
  }
};

export const updateRecruiterNotes = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { applicationId } = req.params;
    const { notes } = req.body;
    
    const application = await ApplicationService.updateRecruiterNotes(applicationId, tenantId, notes, req.user);
    return apiResponse(res, HTTP_STATUS.OK, 'Recruiter notes updated successfully', application);
  } catch (error) {
    next(error);
  }
};
