import { ProjectRepository } from '../repositories/project.repository.js';
import Student from '../models/Student.js';
import { NotFoundError, ConflictError } from '../errors/AppError.js';

export class ProjectService {
  static async addProject(userId, tenantId, projectData) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    const existingProject = await ProjectRepository.existsByTitle(student._id, tenantId, projectData.title);
    if (existingProject) {
      throw new ConflictError(`Project '${projectData.title}' already exists in your profile.`);
    }

    // Determine max display order
    const existingProjects = await ProjectRepository.findByStudentId(student._id, tenantId);
    let maxOrder = -1;
    existingProjects.forEach((p) => {
      if (p.displayOrder > maxOrder) {
        maxOrder = p.displayOrder;
      }
    });

    const newProjectData = {
      ...projectData,
      studentId: student._id,
      tenantId,
      createdBy: userId,
      displayOrder: maxOrder + 1,
    };

    return ProjectRepository.create(newProjectData);
  }

  static async getStudentProjects(targetStudentId, requestingUserTenantId) {
    const student = await Student.findOne({ _id: targetStudentId, tenantId: requestingUserTenantId });
    if (!student) {
      throw new NotFoundError('Student not found or access denied.');
    }

    return ProjectRepository.findByStudentId(targetStudentId, requestingUserTenantId);
  }

  static async updateProject(projectId, userId, userRole, tenantId, updateData) {
    const project = await ProjectRepository.findById(projectId, tenantId);
    if (!project) {
      throw new NotFoundError('Project not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || project.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Project not found or you do not have permission.');
      }
    }

    if (updateData.title && updateData.title.toLowerCase() !== project.title.toLowerCase()) {
      const existingProject = await ProjectRepository.existsByTitle(project.studentId, tenantId, updateData.title);
      if (existingProject) {
        throw new ConflictError(`Project '${updateData.title}' already exists in the profile.`);
      }
    }

    return ProjectRepository.update(project, updateData, userId);
  }

  static async deleteProject(projectId, userId, userRole, tenantId) {
    const project = await ProjectRepository.findById(projectId, tenantId);
    if (!project) {
      throw new NotFoundError('Project not found.');
    }

    if (userRole === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student || project.studentId.toString() !== student._id.toString()) {
        throw new NotFoundError('Project not found or you do not have permission.');
      }
    }

    await ProjectRepository.softDelete(project, userId);
    return true;
  }
}
