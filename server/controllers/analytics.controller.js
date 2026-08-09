import { AnalyticsService } from '../services/analytics/analytics.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const getStudentAnalytics = async (req, res, next) => {
  try {
    const { _id: studentId, tenantId } = req.user;
    const data = await AnalyticsService.getStudentAnalytics(studentId, tenantId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, data);
  } catch (error) {
    next(error);
  }
};

export const getRecruiterAnalytics = async (req, res, next) => {
  try {
    const { companyId, tenantId } = req.user;
    if (!companyId) {
      return apiResponse(res, HTTP_STATUS.FORBIDDEN, 'User is not associated with a company', null);
    }
    const data = await AnalyticsService.getCompanyAnalytics(companyId, tenantId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, data);
  } catch (error) {
    next(error);
  }
};

export const getTenantAnalytics = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const data = await AnalyticsService.getTenantAnalytics(tenantId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, data);
  } catch (error) {
    next(error);
  }
};
