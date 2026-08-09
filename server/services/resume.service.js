import { ResumeRepository } from '../repositories/resume.repository.js';
import Student from '../models/Student.js';
import { NotFoundError, ConflictError } from '../errors/AppError.js';
import { StorageService } from './storage.service.js';
import { ResumeParserService } from './resumeParser.service.js';
import { RESUME_CONSTANTS } from '../constants/resume.constants.js';

export class ResumeService {
  static async uploadResume(userId, tenantId, resumeData) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    // Upload the file to local storage
    if (!resumeData.base64File) {
      throw new Error('Missing base64 file data.');
    }

    const fileUrl = await StorageService.uploadFile(
      resumeData.base64File,
      resumeData.originalFileName,
      tenantId,
      student._id
    );

    const existingResumes = await ResumeRepository.findByStudentId(student._id, tenantId);
    let isPrimary = resumeData.isPrimary;
    if (existingResumes.length === 0) {
      isPrimary = true;
    }

    const version = existingResumes.length + 1;

    if (isPrimary && existingResumes.length > 0) {
      await ResumeRepository.setAllNonPrimary(student._id, tenantId, userId);
    }

    const newResumeData = {
      ...resumeData,
      isPrimary,
      version,
      studentId: student._id,
      userId,
      tenantId,
      createdBy: userId,
      fileUrl,
      uploadStatus: RESUME_CONSTANTS.UPLOAD_STATUS.COMPLETED,
      parsingStatus: RESUME_CONSTANTS.PARSING_STATUS.PENDING
    };

    let createdResume = await ResumeRepository.create(newResumeData);

    // Asynchronous Parsing (we await here for MVP, but can be moved to background)
    try {
      const physicalPath = StorageService.getPhysicalPath(fileUrl);
      const parsedData = await ResumeParserService.parseResume(physicalPath, resumeData.fileType);
      
      if (parsedData) {
        createdResume.parsedData = parsedData;
        createdResume.parsingStatus = RESUME_CONSTANTS.PARSING_STATUS.COMPLETED;
        createdResume.parsedAt = new Date();
      } else {
        createdResume.parsingStatus = RESUME_CONSTANTS.PARSING_STATUS.FAILED;
      }
      
      createdResume = await ResumeRepository.update(createdResume, { 
        parsedData: createdResume.parsedData,
        parsingStatus: createdResume.parsingStatus,
        parsedAt: createdResume.parsedAt
      }, userId);
    } catch (e) {
      console.error('Error during inline parsing:', e);
      createdResume = await ResumeRepository.update(createdResume, { 
        parsingStatus: RESUME_CONSTANTS.PARSING_STATUS.FAILED 
      }, userId);
    }

    return createdResume;
  }

  static async retryParsing(resumeId, userId, tenantId) {
    const resume = await ResumeRepository.findById(resumeId, tenantId);
    if (!resume) throw new NotFoundError('Resume not found.');

    const student = await Student.findOne({ userId });
    if (!student || resume.studentId.toString() !== student._id.toString()) {
      throw new NotFoundError('Resume not found or you do not have permission.');
    }

    const physicalPath = StorageService.getPhysicalPath(resume.fileUrl);
    const parsedData = await ResumeParserService.parseResume(physicalPath, resume.fileType);

    if (parsedData) {
      resume.parsedData = parsedData;
      resume.parsingStatus = RESUME_CONSTANTS.PARSING_STATUS.COMPLETED;
      resume.parsedAt = new Date();
    } else {
      resume.parsingStatus = RESUME_CONSTANTS.PARSING_STATUS.FAILED;
    }

    return ResumeRepository.update(resume, {
      parsedData: resume.parsedData,
      parsingStatus: resume.parsingStatus,
      parsedAt: resume.parsedAt
    }, userId);
  }

  static async getStudentResumes(targetStudentId, requestingUserTenantId) {
    const student = await Student.findOne({ _id: targetStudentId, tenantId: requestingUserTenantId });
    if (!student) {
      throw new NotFoundError('Student not found or access denied.');
    }

    return ResumeRepository.findByStudentId(targetStudentId, requestingUserTenantId);
  }

  static async getResumeById(resumeId, targetStudentId, requestingUserTenantId) {
    const student = await Student.findOne({ _id: targetStudentId, tenantId: requestingUserTenantId });
    if (!student) {
      throw new NotFoundError('Student not found or access denied.');
    }

    const resume = await ResumeRepository.findById(resumeId, requestingUserTenantId);
    if (!resume || resume.studentId.toString() !== student._id.toString()) {
      throw new NotFoundError('Resume not found.');
    }

    return resume;
  }

  static async updateResume(resumeId, userId, userRole, tenantId, updateData) {
    const resume = await ResumeRepository.findById(resumeId, tenantId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || resume.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Resume not found or you do not have permission.');
      }
    }

    // Handle primary toggle
    if (updateData.isPrimary === true && !resume.isPrimary) {
      // Unset all other resumes for this student
      await ResumeRepository.setAllNonPrimary(resume.studentId, tenantId, userId, resumeId);
    } else if (updateData.isPrimary === false && resume.isPrimary) {
      throw new ConflictError('Cannot unset primary resume directly. Set another resume as primary instead.');
    }

    return ResumeRepository.update(resume, updateData, userId);
  }

  static async deleteResume(resumeId, userId, userRole, tenantId) {
    const resume = await ResumeRepository.findById(resumeId, tenantId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || resume.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Resume not found or you do not have permission.');
      }
    }

    const wasPrimary = resume.isPrimary;
    await ResumeRepository.softDelete(resume, userId);
    
    // Also delete the physical file
    await StorageService.deleteFile(resume.fileUrl);

    // If we deleted the primary resume, make the most recent remaining resume primary
    if (wasPrimary) {
      const remainingResumes = await ResumeRepository.findByStudentId(resume.studentId, tenantId);
      if (remainingResumes.length > 0) {
        const mostRecent = remainingResumes[0];
        await ResumeRepository.update(mostRecent, { isPrimary: true }, userId);
      }
    }

    return true;
  }

  static async downloadResume(resumeId, userId, userRole, tenantId) {
    const resume = await ResumeRepository.findById(resumeId, tenantId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || resume.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Resume not found or you do not have permission.');
      }
    }

    return StorageService.getPhysicalPath(resume.fileUrl);
  }
}
