import { CompanyService } from '../services/company.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const createCompany = async (req, res, next) => {
  try {
    const { tenantId, _id: userId } = req.user;
    const company = await CompanyService.createCompany(tenantId, userId, req.body);
    return apiResponse(res, HTTP_STATUS.CREATED, 'Company created successfully', company);
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { companyId } = req.params;
    const company = await CompanyService.getCompanyById(companyId, tenantId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, company);
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const companies = await CompanyService.getCompaniesByTenant(tenantId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, companies);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role, companyId: userCompanyId } = req.user;
    const { companyId } = req.params;
    
    const company = await CompanyService.updateCompany(
      companyId,
      tenantId,
      userId,
      req.body,
      role,
      userCompanyId
    );
    return apiResponse(res, HTTP_STATUS.OK, 'Company updated successfully', company);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role, companyId: userCompanyId } = req.user;
    const { companyId } = req.params;
    
    await CompanyService.deleteCompany(
      companyId,
      tenantId,
      userId,
      role,
      userCompanyId
    );
    return apiResponse(res, HTTP_STATUS.OK, 'Company deleted successfully');
  } catch (error) {
    next(error);
  }
};
