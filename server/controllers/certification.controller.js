import { CertificationService } from '../services/certification.service.js';
import { success, created, updated, deleted } from '../utils/apiResponse.js';
import Student from '../models/Student.js';
import { NotFoundError } from '../errors/AppError.js';

export const addCertification = async (req, res, next) => {
  try {
    const certification = await CertificationService.addCertification(req.user.id, req.user.tenantId, req.body);
    return created(res, certification, 'Certification added successfully.');
  } catch (error) {
    next(error);
  }
};

export const getMyCertifications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) throw new NotFoundError('Student profile not found.');

    const certifications = await CertificationService.getStudentCertifications(student._id, req.user.tenantId);
    return success(res, certifications, 'Certifications retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getStudentCertificationsById = async (req, res, next) => {
  try {
    const certifications = await CertificationService.getStudentCertifications(req.params.id, req.user.tenantId);
    return success(res, certifications, 'Certifications retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const certification = await CertificationService.updateCertification(
      req.params.certificationId,
      req.user.id,
      req.user.role,
      req.user.tenantId,
      req.body
    );
    return updated(res, certification, 'Certification updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    await CertificationService.deleteCertification(
      req.params.certificationId,
      req.user.id,
      req.user.role,
      req.user.tenantId
    );
    return deleted(res, 'Certification deleted successfully.');
  } catch (error) {
    next(error);
  }
};
