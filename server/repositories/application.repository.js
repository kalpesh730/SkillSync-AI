import Application from '../models/Application.js';
import { APPLICATION_STATUS } from '../constants/application.constants.js';

export class ApplicationRepository {
  static async create(data) {
    const application = new Application(data);
    return await application.save();
  }

  static async findById(id, tenantId) {
    return await Application.findOne({ _id: id, tenantId, isDeleted: false })
      .populate('studentId', 'firstName lastName email profile')
      .populate('jobId', 'title employmentType workplaceType location status companyId')
      .populate('companyId', 'name logoUrl');
  }

  static async findByStudentId(studentId, tenantId) {
    return await Application.find({ studentId, tenantId, isDeleted: false })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title employmentType workplaceType location status companyId')
      .populate('companyId', 'name logoUrl');
  }

  static async findByJobId(jobId, tenantId) {
    return await Application.find({ jobId, tenantId, isDeleted: false })
      .sort({ appliedAt: -1 })
      .populate('studentId', 'firstName lastName email profile');
  }

  static async findByCompanyId(companyId, tenantId) {
    return await Application.find({ companyId, tenantId, isDeleted: false })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title status')
      .populate('studentId', 'firstName lastName email profile');
  }

  static async checkExistingApplication(studentId, jobId, tenantId) {
    return await Application.findOne({ studentId, jobId, tenantId, isDeleted: false });
  }

  static async updateStatus(id, tenantId, status, userId) {
    const updateData = {
      status,
      updatedBy: userId,
    };
    
    // Add timestamps based on status
    if (status === APPLICATION_STATUS.SCREENING) updateData.screeningAt = new Date();
    if (status === APPLICATION_STATUS.SHORTLISTED) updateData.shortlistedAt = new Date();
    if (status === APPLICATION_STATUS.INTERVIEW) updateData.interviewAt = new Date();
    if (status === APPLICATION_STATUS.SELECTED) updateData.selectedAt = new Date();
    if (status === APPLICATION_STATUS.REJECTED) updateData.rejectedAt = new Date();
    if (status === APPLICATION_STATUS.WITHDRAWN) updateData.withdrawnAt = new Date();

    return await Application.findOneAndUpdate(
      { _id: id, tenantId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .populate('jobId', 'title companyId')
    .populate('companyId', 'name logoUrl')
    .populate('studentId', 'firstName lastName email profile');
  }

  static async updateRecruiterNotes(id, tenantId, notes, userId) {
    return await Application.findOneAndUpdate(
      { _id: id, tenantId, isDeleted: false },
      { 
        $set: { 
          recruiterNotes: notes,
          updatedBy: userId 
        } 
      },
      { new: true, runValidators: true }
    );
  }

  static async softDelete(id, tenantId, userId) {
    return await Application.findOneAndUpdate(
      { _id: id, tenantId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedBy: userId,
          status: APPLICATION_STATUS.WITHDRAWN,
        },
      },
      { new: true }
    );
  }
}
