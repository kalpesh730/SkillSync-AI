import Skill from '../models/Skill.js';

export class SkillRepository {
  /**
   * Find a skill by its ID, ensuring it belongs to the tenant and is not deleted.
   */
  static async findById(skillId, tenantId) {
    return Skill.findOne({ _id: skillId, tenantId, isDeleted: false });
  }

  /**
   * Find skills by student ID, ensuring tenant isolation.
   */
  static async findByStudentId(studentId, tenantId) {
    return Skill.find({ studentId, tenantId, isDeleted: false }).sort({ displayOrder: 1, name: 1 });
  }

  /**
   * Create a new skill.
   */
  static async create(skillData) {
    const skill = new Skill(skillData);
    return skill.save();
  }

  /**
   * Update a skill.
   */
  static async update(skill, updateData, userId) {
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        skill[key] = updateData[key];
      }
    });
    skill.updatedBy = userId;
    return skill.save();
  }

  /**
   * Soft delete a skill.
   */
  static async softDelete(skill, userId) {
    skill.isDeleted = true;
    skill.deletedAt = new Date();
    skill.updatedBy = userId;
    return skill.save();
  }

  /**
   * Check if a skill exists with the same name for a student (case-insensitive).
   * Note: The MongoDB unique index handles strict enforcement, but this can be used for custom validation if needed.
   */
  static async existsByName(studentId, tenantId, name) {
    return Skill.findOne({
      studentId,
      tenantId,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isDeleted: false,
    });
  }

  /**
   * Reorder skills in bulk.
   */
  static async bulkUpdateOrder(studentId, tenantId, skillOrders, userId) {
    const bulkOps = skillOrders.map((item) => ({
      updateOne: {
        filter: { _id: item.skillId, studentId, tenantId, isDeleted: false },
        update: { $set: { displayOrder: item.displayOrder, updatedBy: userId } },
      },
    }));

    if (bulkOps.length > 0) {
      return Skill.bulkWrite(bulkOps);
    }
    return null;
  }
}
