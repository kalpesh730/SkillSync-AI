import Company from '../models/Company.js';

export class CompanyRepository {
  static async create(companyData) {
    const company = new Company(companyData);
    return await company.save();
  }

  static async findById(companyId, tenantId) {
    const filter = { _id: companyId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Company.findOne(filter);
  }

  static async findByTenantId(tenantId) {
    const filter = { isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Company.find(filter).sort({ createdAt: -1 });
  }

  static async update(companyId, tenantId, updateData, userId) {
    updateData.updatedBy = userId;
    const filter = { _id: companyId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Company.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  static async softDelete(companyId, tenantId, userId) {
    const filter = { _id: companyId, isDeleted: false };
    if (tenantId) filter.tenantId = tenantId;
    return await Company.findOneAndUpdate(
      filter,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedBy: userId,
          status: 'INACTIVE',
        },
      },
      { new: true }
    );
  }
}
