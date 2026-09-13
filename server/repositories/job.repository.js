import Job from '../models/Job.js';
import { JOB_STATUS } from '../constants/job.constants.js';

export class JobRepository {
  static async create(jobData) {
    const job = new Job(jobData);
    return await job.save();
  }

  static async findById(jobId, tenantId) {
    const filter = { _id: jobId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Job.findOne(filter)
      .populate('companyId', 'name logoUrl industry location');
  }

  static async findByCompanyId(companyId, tenantId) {
    const filter = { companyId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate('companyId', 'name logoUrl industry location');
  }

  static async findPublishedByTenantId(tenantId, filters = {}) {
    const query = { status: JOB_STATUS.PUBLISHED, isDeleted: false, ...filters };
    if (tenantId) query.tenantId = tenantId;
    return await Job.find(query)
      .sort({ publishedAt: -1 })
      .populate('companyId', 'name logoUrl industry location');
  }

  static async update(jobId, tenantId, updateData, userId) {
    updateData.updatedBy = userId;
    const filter = { _id: jobId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Job.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('companyId', 'name logoUrl industry location');
  }

  static async softDelete(jobId, tenantId, userId) {
    const filter = { _id: jobId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Job.findOneAndUpdate(
      filter,
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
