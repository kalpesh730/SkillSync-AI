import { ProjectService } from '../services/project.service.js';
import { success, created, updated, deleted } from '../utils/apiResponse.js';
import Student from '../models/Student.js';
import { NotFoundError } from '../errors/AppError.js';

export const addProject = async (req, res, next) => {
  try {
    const project = await ProjectService.addProject(req.user.id, req.user.tenantId, req.body);
    return created(res, project, 'Project added successfully.');
  } catch (error) {
    next(error);
  }
};

export const getMyProjects = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) throw new NotFoundError('Student profile not found.');

    const projects = await ProjectService.getStudentProjects(student._id, req.user.tenantId);
    return success(res, projects, 'Projects retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getStudentProjectsById = async (req, res, next) => {
  try {
    const projects = await ProjectService.getStudentProjects(req.params.id, req.user.tenantId);
    return success(res, projects, 'Projects retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await ProjectService.updateProject(
      req.params.projectId,
      req.user.id,
      req.user.role,
      req.user.tenantId,
      req.body
    );
    return updated(res, project, 'Project updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await ProjectService.deleteProject(
      req.params.projectId,
      req.user.id,
      req.user.role,
      req.user.tenantId
    );
    return deleted(res, 'Project deleted successfully.');
  } catch (error) {
    next(error);
  }
};
