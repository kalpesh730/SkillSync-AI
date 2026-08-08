import Project from '../models/Project.js';

export class ProjectRepository {
  static async create(projectData) {
    const project = new Project(projectData);
    return project.save();
  }

  static async findById(projectId, tenantId) {
    return Project.findOne({
      _id: projectId,
      tenantId,
      isDeleted: false,
    });
  }

  static async findByStudentId(studentId, tenantId) {
    return Project.find({
      studentId,
      tenantId,
      isDeleted: false,
    }).sort({ displayOrder: 1, endDate: -1, createdAt: -1 });
  }

  static async existsByTitle(studentId, tenantId, title) {
    const project = await Project.findOne({
      studentId,
      tenantId,
      title,
      isDeleted: false,
    }).collation({ locale: 'en', strength: 2 });
    
    return !!project;
  }

  static async update(project, updateData, userId) {
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        project[key] = updateData[key];
      }
    });
    project.updatedBy = userId;
    return project.save();
  }

  static async softDelete(project, userId) {
    project.isDeleted = true;
    project.deletedAt = new Date();
    project.updatedBy = userId;
    return project.save();
  }
}
