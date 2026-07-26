import { SkillRepository } from '../repositories/skill.repository.js';
import Student from '../models/Student.js';
import { NotFoundError, ConflictError } from '../errors/AppError.js';

export class SkillService {
  /**
   * Add a new skill for a student
   */
  static async addSkill(userId, tenantId, skillData) {
    // 1. Resolve studentId from userId
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    // 2. Prevent duplicates (case-insensitive)
    const existingSkill = await SkillRepository.existsByName(student._id, tenantId, skillData.name);
    if (existingSkill) {
      throw new ConflictError(`Skill '${skillData.name}' already exists in your profile.`);
    }

    // 3. Determine max display order to append to the end
    const existingSkills = await SkillRepository.findByStudentId(student._id, tenantId);
    let maxOrder = -1;
    existingSkills.forEach((s) => {
      if (s.displayOrder > maxOrder) {
        maxOrder = s.displayOrder;
      }
    });

    // 4. Create Skill
    const newSkillData = {
      ...skillData,
      studentId: student._id,
      tenantId,
      createdBy: userId,
      displayOrder: maxOrder + 1,
    };

    return SkillRepository.create(newSkillData);
  }

  /**
   * Get all skills for a student (context-aware of tenant)
   */
  static async getStudentSkills(targetStudentId, requestingUserTenantId) {
    // Verify target student belongs to the tenant
    const student = await Student.findOne({ _id: targetStudentId, tenantId: requestingUserTenantId });
    if (!student) {
      throw new NotFoundError('Student not found or access denied.');
    }

    return SkillRepository.findByStudentId(targetStudentId, requestingUserTenantId);
  }

  /**
   * Update a skill
   */
  static async updateSkill(skillId, userId, userRole, tenantId, updateData) {
    const skill = await SkillRepository.findById(skillId, tenantId);
    if (!skill) {
      throw new NotFoundError('Skill not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || skill.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Skill not found or you do not have permission.');
      }
    }

    // Prevent duplicate name if name is being changed
    if (updateData.name && updateData.name.toLowerCase() !== skill.name.toLowerCase()) {
      const existingSkill = await SkillRepository.existsByName(skill.studentId, tenantId, updateData.name);
      if (existingSkill) {
        throw new ConflictError(`Skill '${updateData.name}' already exists in the profile.`);
      }
    }

    return SkillRepository.update(skill, updateData, userId);
  }

  /**
   * Soft delete a skill
   */
  static async deleteSkill(skillId, userId, userRole, tenantId) {
    const skill = await SkillRepository.findById(skillId, tenantId);
    if (!skill) {
      throw new NotFoundError('Skill not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || skill.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Skill not found or you do not have permission.');
      }
    }

    await SkillRepository.softDelete(skill, userId);
    return true;
  }

  /**
   * Reorder skills
   */
  static async reorderSkills(userId, tenantId, skillsOrder) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    await SkillRepository.bulkUpdateOrder(student._id, tenantId, skillsOrder, userId);
    return true;
  }
}
