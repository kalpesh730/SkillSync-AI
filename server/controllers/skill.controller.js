import { SkillService } from '../services/skill.service.js';
import { success, created, deleted, updated } from '../utils/apiResponse.js';
import Student from '../models/Student.js';
import { NotFoundError } from '../errors/AppError.js';

export const addSkill = async (req, res, next) => {
  try {
    const skill = await SkillService.addSkill(req.user.id, req.user.tenantId, req.body);
    return created(res, skill, 'Skill added successfully.');
  } catch (error) {
    next(error);
  }
};

export const getMySkills = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) throw new NotFoundError('Student profile not found.');

    const skills = await SkillService.getStudentSkills(student._id, req.user.tenantId);
    return success(res, skills, 'Skills retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getStudentSkillsById = async (req, res, next) => {
  try {
    const skills = await SkillService.getStudentSkills(req.params.id, req.user.tenantId);
    return success(res, skills, 'Skills retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await SkillService.updateSkill(req.params.skillId, req.user.id, req.user.role, req.user.tenantId, req.body);
    return updated(res, skill, 'Skill updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    await SkillService.deleteSkill(req.params.skillId, req.user.id, req.user.role, req.user.tenantId);
    return deleted(res, null, 'Skill deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const reorderSkills = async (req, res, next) => {
  try {
    await SkillService.reorderSkills(req.user.id, req.user.tenantId, req.body.skills);
    return success(res, null, 'Skills reordered successfully.');
  } catch (error) {
    next(error);
  }
};
