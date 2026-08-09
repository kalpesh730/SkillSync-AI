import Resume from '../models/Resume.js';

export class ResumeRepository {
  static async create(resumeData) {
    const resume = new Resume(resumeData);
    return resume.save();
  }

  static async findById(resumeId, tenantId) {
    return Resume.findOne({
      _id: resumeId,
      tenantId,
      isDeleted: false,
    });
  }

  static async findByStudentId(studentId, tenantId) {
    return Resume.find({
      studentId,
      tenantId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }

  static async findPrimaryByStudentId(studentId, tenantId) {
    return Resume.findOne({
      studentId,
      tenantId,
      isPrimary: true,
      isDeleted: false,
    });
  }

  static async update(resume, updateData, userId) {
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        resume[key] = updateData[key];
      }
    });
    resume.updatedBy = userId;
    return resume.save();
  }

  static async setAllNonPrimary(studentId, tenantId, userId, excludeResumeId = null) {
    const filter = {
      studentId,
      tenantId,
      isPrimary: true,
      isDeleted: false,
    };
    
    if (excludeResumeId) {
      filter._id = { $ne: excludeResumeId };
    }

    return Resume.updateMany(
      filter,
      { 
        $set: { 
          isPrimary: false,
          updatedBy: userId 
        } 
      }
    );
  }

  static async softDelete(resume, userId) {
    resume.isDeleted = true;
    resume.deletedAt = new Date();
    // If it was primary, unset it so another can be made primary
    resume.isPrimary = false; 
    resume.updatedBy = userId;
    return resume.save();
  }
}
