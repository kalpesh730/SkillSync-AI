import { CompanyRepository } from '../repositories/company.repository.js';
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';

export class CompanyService {
  static async createCompany(tenantId, userId, companyData) {
    // For now, allow COLLEGE_ADMIN, PLACEMENT_OFFICER, or a COMPANY_HR to create
    // Depending on RBAC, the controller handles role checks.
    const newCompanyData = {
      ...companyData,
      tenantId,
      createdBy: userId,
    };
    return await CompanyRepository.create(newCompanyData);
  }

  static async getCompanyById(companyId, tenantId) {
    const company = await CompanyRepository.findById(companyId, tenantId);
    if (!company) {
      throw new NotFoundError('Company not found.');
    }
    return company;
  }

  static async getCompaniesByTenant(tenantId) {
    return await CompanyRepository.findByTenantId(tenantId);
  }

  static async updateCompany(companyId, tenantId, userId, updateData, userRole, userCompanyId) {
    const company = await CompanyRepository.findById(companyId, tenantId);
    if (!company) {
      throw new NotFoundError('Company not found.');
    }

    // Role-based restrictions
    if (userRole === 'COMPANY_HR' && company._id.toString() !== userCompanyId?.toString()) {
      throw new ForbiddenError('You can only update your own company.');
    }

    return await CompanyRepository.update(companyId, tenantId, updateData, userId);
  }

  static async deleteCompany(companyId, tenantId, userId, userRole, userCompanyId) {
    const company = await CompanyRepository.findById(companyId, tenantId);
    if (!company) {
      throw new NotFoundError('Company not found.');
    }

    // Usually, only admins can delete a company, or maybe HR.
    if (userRole === 'COMPANY_HR' && company._id.toString() !== userCompanyId?.toString()) {
      throw new ForbiddenError('You can only delete your own company.');
    }

    await CompanyRepository.softDelete(companyId, tenantId, userId);
    return true;
  }
}
