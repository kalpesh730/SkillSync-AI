import { JobRepository } from '../repositories/job.repository.js';
import { CompanyService } from './company.service.js';
import { NotFoundError, ForbiddenError } from '../errors/AppError.js';
import { JOB_STATUS } from '../constants/job.constants.js';

export class JobService {
  static async createJob(tenantId, userId, companyId, jobData, userRole, userCompanyId) {
    if (userRole === 'COMPANY_HR' || userRole === 'RECRUITER') {
      if (companyId.toString() !== userCompanyId?.toString()) {
        throw new ForbiddenError('You can only create jobs for your own company.');
      }
    }
    
    // Validate company exists
    await CompanyService.getCompanyById(companyId, tenantId);

    const newJobData = {
      ...jobData,
      tenantId,
      companyId,
      createdBy: userId,
      status: JOB_STATUS.DRAFT,
    };
    
    return await JobRepository.create(newJobData);
  }

  static async getJobById(jobId, tenantId, userRole, userCompanyId) {
    const job = await JobRepository.findById(jobId, tenantId);
    if (!job) {
      throw new NotFoundError('Job not found.');
    }

    if (userRole === 'STUDENT' && job.status !== JOB_STATUS.PUBLISHED) {
      throw new ForbiddenError('This job is not currently published.');
    }

    if ((userRole === 'COMPANY_HR' || userRole === 'RECRUITER') && job.companyId._id.toString() !== userCompanyId?.toString()) {
      throw new ForbiddenError('You can only view jobs from your own company.');
    }

    return job;
  }

  static async getCompanyJobs(companyId, tenantId, userRole, userCompanyId) {
    if (userRole === 'COMPANY_HR' || userRole === 'RECRUITER') {
      if (companyId.toString() !== userCompanyId?.toString()) {
        throw new ForbiddenError('You can only view jobs for your own company.');
      }
    }
    return await JobRepository.findByCompanyId(companyId, tenantId);
  }

  static async getPublishedJobs(tenantId, filters = {}) {
    return await JobRepository.findPublishedByTenantId(tenantId, filters);
  }

  static async updateJob(jobId, tenantId, userId, updateData, userRole, userCompanyId) {
    const job = await JobRepository.findById(jobId, tenantId);
    if (!job) {
      throw new NotFoundError('Job not found.');
    }

    if (userRole === 'COMPANY_HR' || userRole === 'RECRUITER') {
      if (job.companyId._id.toString() !== userCompanyId?.toString()) {
        throw new ForbiddenError('You can only update jobs for your own company.');
      }
    }

    return await JobRepository.update(jobId, tenantId, updateData, userId);
  }

  static async updateJobStatus(jobId, tenantId, userId, status, userRole, userCompanyId) {
    const job = await JobRepository.findById(jobId, tenantId);
    if (!job) {
      throw new NotFoundError('Job not found.');
    }

    if (userRole === 'COMPANY_HR' || userRole === 'RECRUITER') {
      if (job.companyId._id.toString() !== userCompanyId?.toString()) {
        throw new ForbiddenError('You can only update jobs for your own company.');
      }
    }

    const updateData = { status };
    if (status === JOB_STATUS.PUBLISHED && job.status !== JOB_STATUS.PUBLISHED) {
      updateData.publishedAt = new Date();
    } else if (status === JOB_STATUS.CLOSED && job.status !== JOB_STATUS.CLOSED) {
      updateData.closedAt = new Date();
    }

    return await JobRepository.update(jobId, tenantId, updateData, userId);
  }

  static async deleteJob(jobId, tenantId, userId, userRole, userCompanyId) {
    const job = await JobRepository.findById(jobId, tenantId);
    if (!job) {
      throw new NotFoundError('Job not found.');
    }

    if (userRole === 'COMPANY_HR' || userRole === 'RECRUITER') {
      if (job.companyId._id.toString() !== userCompanyId?.toString()) {
        throw new ForbiddenError('You can only delete jobs for your own company.');
      }
    }

    await JobRepository.softDelete(jobId, tenantId, userId);
    return true;
  }
}
