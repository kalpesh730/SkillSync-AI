import Certification from '../models/Certification.js';

export class CertificationRepository {
  static async create(certificationData) {
    const certification = new Certification(certificationData);
    return certification.save();
  }

  static async findById(certificationId, tenantId) {
    return Certification.findOne({
      _id: certificationId,
      tenantId,
      isDeleted: false,
    });
  }

  static async findByStudentId(studentId, tenantId) {
    return Certification.find({
      studentId,
      tenantId,
      isDeleted: false,
    }).sort({ issueDate: -1, createdAt: -1 });
  }

  static async existsByName(studentId, tenantId, name) {
    const certification = await Certification.findOne({
      studentId,
      tenantId,
      name,
      isDeleted: false,
    }).collation({ locale: 'en', strength: 2 });
    
    return !!certification;
  }

  static async update(certification, updateData, userId) {
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        certification[key] = updateData[key];
      }
    });
    certification.updatedBy = userId;
    return certification.save();
  }

  static async softDelete(certification, userId) {
    certification.isDeleted = true;
    certification.deletedAt = new Date();
    certification.updatedBy = userId;
    return certification.save();
  }
}
