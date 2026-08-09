import { CertificationRepository } from '../repositories/certification.repository.js';
import Student from '../models/Student.js';
import { NotFoundError, ConflictError } from '../errors/AppError.js';

export class CertificationService {
  static async addCertification(userId, tenantId, certificationData) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    const existingCertification = await CertificationRepository.existsByName(student._id, tenantId, certificationData.name);
    if (existingCertification) {
      throw new ConflictError(`Certification '${certificationData.name}' already exists in your profile.`);
    }

    const newCertificationData = {
      ...certificationData,
      studentId: student._id,
      tenantId,
      createdBy: userId,
    };

    return CertificationRepository.create(newCertificationData);
  }

  static async getStudentCertifications(targetStudentId, requestingUserTenantId) {
    const student = await Student.findOne({ _id: targetStudentId, tenantId: requestingUserTenantId });
    if (!student) {
      throw new NotFoundError('Student not found or access denied.');
    }

    return CertificationRepository.findByStudentId(targetStudentId, requestingUserTenantId);
  }

  static async updateCertification(certificationId, userId, userRole, tenantId, updateData) {
    const certification = await CertificationRepository.findById(certificationId, tenantId);
    if (!certification) {
      throw new NotFoundError('Certification not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || certification.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Certification not found or you do not have permission.');
      }
    }

    if (updateData.name && updateData.name.toLowerCase() !== certification.name.toLowerCase()) {
      const existingCertification = await CertificationRepository.existsByName(certification.studentId, tenantId, updateData.name);
      if (existingCertification) {
        throw new ConflictError(`Certification '${updateData.name}' already exists in the profile.`);
      }
    }

    return CertificationRepository.update(certification, updateData, userId);
  }

  static async deleteCertification(certificationId, userId, userRole, tenantId) {
    const certification = await CertificationRepository.findById(certificationId, tenantId);
    if (!certification) {
      throw new NotFoundError('Certification not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || certification.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Certification not found or you do not have permission.');
      }
    }

    await CertificationRepository.softDelete(certification, userId);
    return true;
  }
}
