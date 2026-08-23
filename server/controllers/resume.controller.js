import { ResumeService } from '../services/resume.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import Student from '../models/Student.js';

export const uploadResume = async (req, res, next) => {
  try {
    const { _id: userId, tenantId } = req.user;
    const resume = await ResumeService.uploadResume(userId, tenantId, req.body);
    return apiResponse(res, HTTP_STATUS.CREATED, 'Resume uploaded successfully.', resume);
  } catch (error) {
    next(error);
  }
};

export const getMyResumes = async (req, res, next) => {
  try {
    const { _id: userId, tenantId, role: userRole, companyId: userCompanyId } = req.user;
    const student = await Student.findOne({ userId });
    
    if (!student) {
      return apiResponse(res, HTTP_STATUS.NOT_FOUND, 'Student profile not found.');
    }

    const resumes = await ResumeService.getStudentResumes(student._id, tenantId, userRole, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, resumes);
  } catch (error) {
    next(error);
  }
};

export const getStudentResumesById = async (req, res, next) => {
  try {
    const { tenantId, role: userRole, companyId: userCompanyId } = req.user;
    const studentId = req.params.id || req.params.studentId;
    
    const resumes = await ResumeService.getStudentResumes(studentId, tenantId, userRole, userCompanyId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, resumes);
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const { _id: userId, role: userRole, tenantId } = req.user;
    const { resumeId } = req.params;

    const updatedResume = await ResumeService.updateResume(resumeId, userId, userRole, tenantId, req.body);
    return apiResponse(res, HTTP_STATUS.OK, 'Resume updated successfully.', updatedResume);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { _id: userId, role: userRole, tenantId } = req.user;
    const { resumeId } = req.params;

    await ResumeService.deleteResume(resumeId, userId, userRole, tenantId);
    return apiResponse(res, HTTP_STATUS.OK, 'Resume deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const retryParsing = async (req, res, next) => {
  try {
    const { _id: userId, tenantId } = req.user;
    const { resumeId } = req.params;

    const resume = await ResumeService.retryParsing(resumeId, userId, tenantId);
    return apiResponse(res, HTTP_STATUS.OK, 'Resume parsing retried successfully.', resume);
  } catch (error) {
    next(error);
  }
};

export const downloadResume = async (req, res, next) => {
  try {
    const { _id: userId, role: userRole, tenantId, companyId: userCompanyId } = req.user;
    const { resumeId } = req.params;

    const physicalPath = await ResumeService.downloadResume(resumeId, userId, userRole, tenantId, userCompanyId);
    
    res.sendFile(physicalPath, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};
