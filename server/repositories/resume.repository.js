import Resume from '../models/Resume.js';

export class ResumeRepository {
  static async create(resumeData) {
    const resume = new Resume(resumeData);
    return resume.save();
  }

  static async findById(resumeId, tenantId) {
    const query = {
      _id: resumeId,
      isDeleted: false,
    };
    if (tenantId) {
      query.tenantId = tenantId;
    }
    return Resume.findOne(query);
  }

  static async findByStudentId(studentId, tenantId) {
    const query = {
      studentId,
      isDeleted: false,
    };
    if (tenantId) {
      query.tenantId = tenantId;
    }
    return Resume.find(query).sort({ createdAt: -1 });
  }

  static async findPrimaryByStudentId(studentId, tenantId) {
    const query = {
      studentId,
      isPrimary: true,
      isDeleted: false,
    };
    if (tenantId) {
      query.tenantId = tenantId;
    }
    return Resume.findOne(query);
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
      isPrimary: true,
      isDeleted: false,
    };
    if (tenantId) {
      filter.tenantId = tenantId;
    }
    
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
