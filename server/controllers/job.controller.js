import { JobService } from '../services/job.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const createJob = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role, companyId: userCompanyId } = req.user;
    const { companyId } = req.body;
    
    const job = await JobService.createJob(tenantId, userId, companyId, req.body, role, userCompanyId);
    return apiResponse(res, HTTP_STATUS.CREATED, 'Job created successfully', job);
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { tenantId, role, companyId: userCompanyId } = req.user;
    const { jobId } = req.params;
    const job = await JobService.getJobById(jobId, tenantId, role, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, job);
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobs = async (req, res, next) => {
  try {
    const { tenantId, role, companyId: userCompanyId } = req.user;
    const { companyId } = req.params;
    
    const jobs = await JobService.getCompanyJobs(companyId, tenantId, role, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, jobs);
  } catch (error) {
    next(error);
  }
};

export const getPublishedJobs = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    // filters can be parsed from req.query
    const jobs = await JobService.getPublishedJobs(tenantId, req.query);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, jobs);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role, companyId: userCompanyId } = req.user;
    const { jobId } = req.params;
    
    const job = await JobService.updateJob(jobId, tenantId, userId, req.body, role, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, 'Job updated successfully', job);
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role, companyId: userCompanyId } = req.user;
    const { jobId } = req.params;
    const { status } = req.body;
    
    const job = await JobService.updateJobStatus(jobId, tenantId, userId, status, role, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, 'Job status updated successfully', job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role, companyId: userCompanyId } = req.user;
    const { jobId } = req.params;
    
    await JobService.deleteJob(jobId, tenantId, userId, role, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, 'Job deleted successfully');
  } catch (error) {
    next(error);
  }
};
