import Company from '../models/Company.js';

export class CompanyRepository {
  static async create(companyData) {
    const company = new Company(companyData);
    return await company.save();
  }

  static async findById(companyId, tenantId) {
    return await Company.findOne({ _id: companyId, tenantId, isDeleted: false });
  }

  static async findByTenantId(tenantId) {
    return await Company.find({ tenantId, isDeleted: false }).sort({ createdAt: -1 });
  }

  static async update(companyId, tenantId, updateData, userId) {
    updateData.updatedBy = userId;
    return await Company.findOneAndUpdate(
      { _id: companyId, tenantId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  static async softDelete(companyId, tenantId, userId) {
    return await Company.findOneAndUpdate(
      { _id: companyId, tenantId, isDeleted: false },
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
