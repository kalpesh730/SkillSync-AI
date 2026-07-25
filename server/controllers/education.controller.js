import { EducationService } from '../services/education.service.js';
import { success, created, deleted, updated } from '../utils/apiResponse.js';
import Student from '../models/Student.js';
import { NotFoundError } from '../errors/AppError.js';

export const addEducation = async (req, res, next) => {
  try {
    const education = await EducationService.addEducation(req.user.id, req.user.tenantId, req.body);
    return created(res, education, 'Education record added successfully.');
  } catch (error) {
    next(error);
  }
};

export const getMyEducation = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) throw new NotFoundError('Student profile not found.');

    const educationRecords = await EducationService.getStudentEducation(student._id, req.user.tenantId);
    return success(res, educationRecords, 'Education records retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getStudentEducationById = async (req, res, next) => {
  try {
    const educationRecords = await EducationService.getStudentEducation(req.params.id, req.user.tenantId);
    return success(res, educationRecords, 'Education records retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const education = await EducationService.updateEducation(req.params.educationId, req.user.id, req.body);
    return updated(res, education, 'Education record updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    await EducationService.deleteEducation(req.params.educationId, req.user.id);
    return deleted(res, null, 'Education record deleted successfully.');
  } catch (error) {
    next(error);
  }
};
