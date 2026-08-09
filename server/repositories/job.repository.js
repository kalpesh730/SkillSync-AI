import Job from '../models/Job.js';
import { JOB_STATUS } from '../constants/job.constants.js';

export class JobRepository {
  static async create(jobData) {
    const job = new Job(jobData);
    return await job.save();
  }

  static async findById(jobId, tenantId) {
    return await Job.findOne({ _id: jobId, tenantId, isDeleted: false })
      .populate('companyId', 'name logoUrl industry location');
  }

  static async findByCompanyId(companyId, tenantId) {
    return await Job.find({ companyId, tenantId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('companyId', 'name logoUrl industry location');
  }

  static async findPublishedByTenantId(tenantId, filters = {}) {
    const query = { tenantId, status: JOB_STATUS.PUBLISHED, isDeleted: false, ...filters };
    return await Job.find(query)
      .sort({ publishedAt: -1 })
      .populate('companyId', 'name logoUrl industry location');
  }

  static async update(jobId, tenantId, updateData, userId) {
    updateData.updatedBy = userId;
    return await Job.findOneAndUpdate(
      { _id: jobId, tenantId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('companyId', 'name logoUrl industry location');
  }

  static async softDelete(jobId, tenantId, userId) {
    return await Job.findOneAndUpdate(
      { _id: jobId, tenantId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedBy: userId,
          status: JOB_STATUS.ARCHIVED,
        },
      },
      { new: true }
    );
  }
}
