import { StudentService } from '../services/student.service.js';
import { success, updated, paginated } from '../utils/apiResponse.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const student = await StudentService.getProfileByUserId(req.user.id);
    return success(res, student, 'Profile retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const updatedStudent = await StudentService.updateProfile(req.user.id, req.body);
    return updated(res, updatedStudent, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await StudentService.getStudentById(req.params.id, req.user.tenantId);
    return success(res, student, 'Student retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const { students, total } = await StudentService.getAllStudents(req.user.tenantId, req.query);
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    
    return paginated(res, students, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }, 'Students retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { profilePhoto } = req.body;
    const student = await StudentService.updateAvatar(req.user.id, profilePhoto);
    return updated(res, student, 'Avatar updated successfully.');
  } catch (error) {
    next(error);
  }
};
