import Student from '../../models/Student.js';
import Resume from '../../models/Resume.js';
import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
import Company from '../../models/Company.js';
import { APPLICATION_STATUS } from '../../constants/application.constants.js';
import { ROLES } from '../../constants/index.js';

export class AnalyticsService {

  // ============================================================================
  // STAGE B: STUDENT ANALYTICS
  // ============================================================================
  static async getStudentAnalytics(userOrStudentId, tenantId) {
    let student = await Student.findOne({ userId: userOrStudentId }).lean();
    if (!student) {
      student = await Student.findById(userOrStudentId).lean();
    }
    if (!student) return null;

    const studentId = student._id;

    const [resumes, applications, SkillModel, ProjectModel, CertModel, EduModel] = await Promise.all([
      Resume.find({ studentId, isDeleted: false }).lean(),
      Application.find({ studentId, isDeleted: false }).lean(),
      import('../../models/Skill.js').then(m => m.default),
      import('../../models/Project.js').then(m => m.default),
      import('../../models/Certification.js').then(m => m.default),
      import('../../models/Education.js').then(m => m.default)
    ]);

    const [skills, projects, certifications, educations] = await Promise.all([
      SkillModel.find({ studentId, isDeleted: false }).lean(),
      ProjectModel.find({ studentId, isDeleted: false }).lean(),
      CertModel.find({ studentId, isDeleted: false }).lean(),
      EduModel.find({ studentId, isDeleted: false }).lean()
    ]);

    const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];

    // 1. Profile completeness calculation
    let completeness = student.profileCompletion || 0;
    if (!completeness) {
      if (student.firstName && student.lastName) completeness += 20;
      if (educations.length > 0) completeness += 20;
      if (skills.length > 0) completeness += 20;
      if (projects.length > 0) completeness += 20;
      if (primaryResume) completeness += 20;
    }

    // 2. Application breakdown
    const applicationsCount = applications.length;
    const applicationsByStatus = {
      [APPLICATION_STATUS.APPLIED]: 0,
      [APPLICATION_STATUS.SCREENING]: 0,
      [APPLICATION_STATUS.SHORTLISTED]: 0,
      [APPLICATION_STATUS.INTERVIEW]: 0,
      [APPLICATION_STATUS.SELECTED]: 0,
      [APPLICATION_STATUS.REJECTED]: 0,
      [APPLICATION_STATUS.WITHDRAWN]: 0,
    };

    applications.forEach(app => {
      if (applicationsByStatus[app.status] !== undefined) {
        applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
      }
    });

    const activeApplications = applicationsCount - (applicationsByStatus[APPLICATION_STATUS.REJECTED] || 0) - (applicationsByStatus[APPLICATION_STATUS.WITHDRAWN] || 0);
    const successRate = applicationsCount > 0
      ? Math.round(((applicationsByStatus[APPLICATION_STATUS.SELECTED] || 0) / applicationsCount) * 100)
      : 0;

    return {
      profile: {
        completeness,
        skillCount: skills.length,
        projectCount: projects.length,
        certificationCount: certifications.length,
        educationCount: educations.length,
        hasPrimaryResume: !!primaryResume,
      },
      applications: {
        total: applicationsCount,
        active: activeApplications,
        byStatus: applicationsByStatus,
        interviews: applicationsByStatus[APPLICATION_STATUS.INTERVIEW] || 0,
        shortlisted: applicationsByStatus[APPLICATION_STATUS.SHORTLISTED] || 0,
        selected: applicationsByStatus[APPLICATION_STATUS.SELECTED] || 0,
        rejected: applicationsByStatus[APPLICATION_STATUS.REJECTED] || 0,
        successRate,
      }
    };
  }

  // ============================================================================
  // STAGE C: RECRUITER / COMPANY ANALYTICS
  // ============================================================================
  static async getCompanyAnalytics(companyId, tenantId) {
    const jobFilter = { companyId, isDeleted: false };
    if (tenantId) jobFilter.tenantId = tenantId;
    const jobs = await Job.find(jobFilter).sort({ createdAt: -1 }).lean();

    let totalJobs = jobs.length;
    let publishedJobs = 0;
    let closedJobs = 0;

    jobs.forEach(job => {
      if (job.status === 'PUBLISHED') publishedJobs++;
      if (job.status === 'CLOSED') closedJobs++;
    });

    const appFilter = { companyId, isDeleted: false };
    if (tenantId) appFilter.tenantId = tenantId;
    const applications = await Application.find(appFilter)
      .sort({ appliedAt: -1 })
      .populate('studentId', 'name email')
      .populate('jobId', 'title')
      .lean();

    const applicationsCount = applications.length;
    const applicationsByStatus = {
      [APPLICATION_STATUS.APPLIED]: 0,
      [APPLICATION_STATUS.SCREENING]: 0,
      [APPLICATION_STATUS.SHORTLISTED]: 0,
      [APPLICATION_STATUS.INTERVIEW]: 0,
      [APPLICATION_STATUS.SELECTED]: 0,
      [APPLICATION_STATUS.REJECTED]: 0,
      [APPLICATION_STATUS.WITHDRAWN]: 0,
    };

    applications.forEach(app => {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    });

    const conversionRate = applicationsCount > 0
      ? Math.round(((applicationsByStatus[APPLICATION_STATUS.SELECTED] || 0) / applicationsCount) * 100)
      : 0;

    const recentVacancies = jobs.slice(0, 5);
    const recentApplications = applications.slice(0, 5);

    return {
      jobs: {
        total: totalJobs,
        published: publishedJobs,
        closed: closedJobs,
        recent: recentVacancies
      },
      applications: {
        total: applicationsCount,
        byStatus: applicationsByStatus,
        shortlisted: applicationsByStatus[APPLICATION_STATUS.SHORTLISTED] || 0,
        interviews: applicationsByStatus[APPLICATION_STATUS.INTERVIEW] || 0,
        selected: applicationsByStatus[APPLICATION_STATUS.SELECTED] || 0,
        rejected: applicationsByStatus[APPLICATION_STATUS.REJECTED] || 0,
        conversionRate,
        recent: recentApplications
      }
    };
  }

  // ============================================================================
  // STAGE D: COLLEGE / PLACEMENT ANALYTICS
  // ============================================================================
  static async getTenantAnalytics(tenantId) {
    const filter = tenantId ? { tenantId } : {};

    // 1. Students
    const totalStudents = await Student.countDocuments(filter);

    // 2. Companies & Jobs
    const totalCompanies = await Company.countDocuments({ ...filter, isDeleted: false });
    const totalJobs = await Job.countDocuments({ ...filter, status: 'PUBLISHED', isDeleted: false });

    // 3. Applications
    const applications = await Application.find({ ...filter, isDeleted: false }).lean();
    const totalApplications = applications.length;

    let selectedCount = 0;
    const placedStudents = new Set();

    applications.forEach(app => {
      if (app.status === APPLICATION_STATUS.SELECTED) {
        selectedCount++;
        placedStudents.add(app.studentId.toString());
      }
    });

    const studentsPlacedCount = placedStudents.size;
    const placementRate = totalStudents > 0
      ? Math.round((studentsPlacedCount / totalStudents) * 100)
      : 0;

    return {
      students: {
        total: totalStudents,
        placed: studentsPlacedCount,
        placementRate,
      },
      companies: {
        total: totalCompanies,
        activeJobs: totalJobs,
      },
      applications: {
        total: totalApplications,
        selected: selectedCount,
        avgPerStudent: totalStudents > 0 ? (totalApplications / totalStudents).toFixed(1) : 0,
      }
    };
  }
}
