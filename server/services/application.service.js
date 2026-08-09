import { ApplicationRepository } from '../repositories/application.repository.js';
import { JobService } from './job.service.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../errors/AppError.js';
import { APPLICATION_STATUS } from '../constants/application.constants.js';
import { JOB_STATUS } from '../constants/job.constants.js';
import { ROLES } from '../constants/index.js';

const validStatusTransitions = {
  [APPLICATION_STATUS.APPLIED]: [APPLICATION_STATUS.SCREENING, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WITHDRAWN],
  [APPLICATION_STATUS.SCREENING]: [APPLICATION_STATUS.SHORTLISTED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WITHDRAWN],
  [APPLICATION_STATUS.SHORTLISTED]: [APPLICATION_STATUS.INTERVIEW, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WITHDRAWN],
  [APPLICATION_STATUS.INTERVIEW]: [APPLICATION_STATUS.SELECTED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.WITHDRAWN],
  [APPLICATION_STATUS.SELECTED]: [APPLICATION_STATUS.WITHDRAWN],
  [APPLICATION_STATUS.REJECTED]: [],
  [APPLICATION_STATUS.WITHDRAWN]: [],
};

export class ApplicationService {
  static async applyToJob(tenantId, studentId, applicationData) {
    const { jobId, resumeId, coverLetter } = applicationData;

    // 1. Validate Job exists, is published, and not expired
    const job = await JobService.getJobById(jobId, tenantId, ROLES.STUDENT, null);
    
    if (job.status !== JOB_STATUS.PUBLISHED) {
      throw new BadRequestError('You cannot apply to an unpublished job.');
    }
    if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
      throw new BadRequestError('The application deadline has passed.');
    }

    // 2. Prevent duplicates
    const existing = await ApplicationRepository.checkExistingApplication(studentId, jobId, tenantId);
    if (existing) {
      throw new BadRequestError('You have already applied to this job.');
    }

    // 3. Create application
    const newApp = {
      tenantId,
      studentId,
      jobId,
      companyId: job.companyId._id,
      resumeId,
      coverLetter,
      status: APPLICATION_STATUS.APPLIED,
      updatedBy: studentId, // or createdBy, if we had it
    };

    return await ApplicationRepository.create(newApp);
  }

  static async getApplicationById(applicationId, tenantId, user) {
    const application = await ApplicationRepository.findById(applicationId, tenantId);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }

    // RBAC Checks
    if (user.role === ROLES.STUDENT) {
      if (application.studentId._id.toString() !== user._id.toString()) {
        throw new ForbiddenError('You can only view your own applications.');
      }
    } else if (user.role === ROLES.COMPANY_HR || user.role === ROLES.RECRUITER) {
      if (application.companyId._id.toString() !== user.companyId?.toString()) {
        throw new ForbiddenError('You can only view applications for your own company.');
      }
    }

    return application;
  }

  static async getStudentApplications(studentId, tenantId, user) {
    if (user.role === ROLES.STUDENT && user._id.toString() !== studentId.toString()) {
      throw new ForbiddenError('You can only view your own applications.');
    }
    return await ApplicationRepository.findByStudentId(studentId, tenantId);
  }

  static async getJobApplications(jobId, tenantId, user) {
    // Requires company permission
    const job = await JobService.getJobById(jobId, tenantId, user.role, user.companyId);
    
    if (user.role === ROLES.COMPANY_HR || user.role === ROLES.RECRUITER) {
      if (job.companyId._id.toString() !== user.companyId?.toString()) {
        throw new ForbiddenError('You can only view applications for your own jobs.');
      }
    }

    return await ApplicationRepository.findByJobId(jobId, tenantId);
  }

  static async getCompanyApplications(companyId, tenantId, user) {
    if (user.role === ROLES.COMPANY_HR || user.role === ROLES.RECRUITER) {
      if (companyId.toString() !== user.companyId?.toString()) {
        throw new ForbiddenError('You can only view applications for your own company.');
      }
    }
    return await ApplicationRepository.findByCompanyId(companyId, tenantId);
  }

  static async updateApplicationStatus(applicationId, tenantId, newStatus, user) {
    const application = await ApplicationRepository.findById(applicationId, tenantId);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }

    const currentStatus = application.status;

    // Student can only WITHDRAW
    if (user.role === ROLES.STUDENT) {
      if (application.studentId._id.toString() !== user._id.toString()) {
        throw new ForbiddenError('You can only modify your own applications.');
      }
      if (newStatus !== APPLICATION_STATUS.WITHDRAWN) {
        throw new ForbiddenError('Students can only withdraw applications.');
      }
    } 
    // Recruiters manage the pipeline
    else if (user.role === ROLES.COMPANY_HR || user.role === ROLES.RECRUITER) {
      if (application.companyId._id.toString() !== user.companyId?.toString()) {
        throw new ForbiddenError('You can only modify applications for your own company.');
      }
      if (newStatus === APPLICATION_STATUS.WITHDRAWN) {
        throw new ForbiddenError('Recruiters cannot withdraw an application on behalf of a student.');
      }
    }

    // Verify transition validity
    if (!validStatusTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestError(`Invalid status transition from ${currentStatus} to ${newStatus}.`);
    }

    return await ApplicationRepository.updateStatus(applicationId, tenantId, newStatus, user._id);
  }

  static async updateRecruiterNotes(applicationId, tenantId, notes, user) {
    const application = await ApplicationRepository.findById(applicationId, tenantId);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }

    if (user.role === ROLES.COMPANY_HR || user.role === ROLES.RECRUITER) {
      if (application.companyId._id.toString() !== user.companyId?.toString()) {
        throw new ForbiddenError('You can only modify applications for your own company.');
      }
    } else if (user.role === ROLES.STUDENT) {
      throw new ForbiddenError('Students cannot update recruiter notes.');
    }

    return await ApplicationRepository.updateRecruiterNotes(applicationId, tenantId, notes, user._id);
  }
}
