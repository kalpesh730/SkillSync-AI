import Education from '../models/Education.js';
import Student from '../models/Student.js';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '../errors/AppError.js';

export class EducationService {
  /**
   * Add a new education record for a student
   */
  static async addEducation(userId, tenantId, educationData) {
    // 1. Resolve studentId from userId
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    // 2. Validate Start/End Years logic here (could also be done via Zod)
    if (educationData.startYear && educationData.endYear && educationData.startYear > educationData.endYear) {
      throw new ValidationError('Start year cannot be greater than end year.');
    }

    // 3. Create Education
    const education = new Education({
      ...educationData,
      studentId: student._id,
      tenantId,
      createdBy: userId,
    });

    try {
      await education.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictError('An education record with this institution and degree already exists.');
      }
      throw error;
    }

    return education;
  }

  /**
   * Get all education records for a student (context-aware of tenant)
   */
  static async getStudentEducation(targetStudentId, requestingUserTenantId) {
    // Verify target student belongs to the tenant
    const student = await Student.findOne({ _id: targetStudentId, tenantId: requestingUserTenantId });
    if (!student) {
      throw new NotFoundError('Student not found or access denied.');
    }

    const educationRecords = await Education.find({ 
      studentId: targetStudentId, 
      isDeleted: false 
    }).sort({ endYear: -1, passingYear: -1 });

    return educationRecords;
  }

  /**
   * Update an education record
   */
  static async updateEducation(educationId, userId, updateData) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    const education = await Education.findOne({ _id: educationId, studentId: student._id, isDeleted: false });
    if (!education) throw new NotFoundError('Education record not found or you do not have permission.');

    if (updateData.startYear && updateData.endYear && updateData.startYear > updateData.endYear) {
      throw new ValidationError('Start year cannot be greater than end year.');
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        education[key] = updateData[key];
      }
    });

    education.updatedBy = userId;

    try {
      await education.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictError('An education record with this institution and degree already exists.');
      }
      throw error;
    }

    return education;
  }

  /**
   * Soft delete an education record
   */
  static async deleteEducation(educationId, userId) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    const education = await Education.findOne({ _id: educationId, studentId: student._id, isDeleted: false });
    if (!education) throw new NotFoundError('Education record not found or you do not have permission.');

    education.isDeleted = true;
    education.deletedAt = new Date();
    education.updatedBy = userId;

    await education.save();
    
    return true;
  }
}
