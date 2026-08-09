import { AIService } from '../services/ai/ai.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const getATSScore = async (req, res, next) => {
  try {
    const { tenantId, _id: studentId } = req.user;
    const { jobId } = req.params;

    const result = await AIService.getATSScore(studentId, jobId, tenantId);
    
    if (!result) {
      return apiResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, 'AI service is currently unavailable', null);
    }
    
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
  } catch (error) {
    next(error);
  }
};

export const getSkillGap = async (req, res, next) => {
  try {
    const { tenantId, _id: studentId } = req.user;
    const { jobId } = req.params;

    const result = await AIService.getSkillGap(studentId, jobId, tenantId);
    
    if (!result) {
      return apiResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, 'AI service is currently unavailable', null);
    }
    
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
  } catch (error) {
    next(error);
  }
};

export const getJobMatch = async (req, res, next) => {
  try {
    const { tenantId, _id: studentId } = req.user;
    const { jobId } = req.params;

    const result = await AIService.getJobMatch(studentId, jobId, tenantId);
    
    if (!result) {
      return apiResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, 'AI service is currently unavailable', null);
    }
    
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
  } catch (error) {
    next(error);
  }
};

export const getCareerRecommendations = async (req, res, next) => {
  try {
    const { tenantId, _id: studentId } = req.user;

    const result = await AIService.getCareerRecommendations(studentId, tenantId);
    
    if (!result) {
      return apiResponse(res, HTTP_STATUS.SERVICE_UNAVAILABLE, 'AI service is currently unavailable', null);
    }
    
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, result);
  } catch (error) {
    next(error);
  }
};
