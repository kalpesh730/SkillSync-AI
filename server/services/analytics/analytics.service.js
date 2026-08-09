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
  static async getStudentAnalytics(studentId, tenantId) {
    const student = await Student.findOne({ _id: studentId, tenantId }).lean();
    if (!student) return null;

    const resumes = await Resume.find({ studentId, tenantId }).lean();
    const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];

    const applications = await Application.find({ studentId, tenantId }).lean();

    // 1. Profile completeness calculation (basic heuristic)
    let completeness = 0;
    if (student.profile?.headline) completeness += 10;
    if (student.profile?.bio) completeness += 10;
    if (student.profile?.location) completeness += 10;
    if (student.skills?.length > 0) completeness += 20;
    if (student.education?.length > 0) completeness += 20;
    if (student.projects?.length > 0) completeness += 10;
    if (primaryResume) completeness += 20;

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
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    });

    const activeApplications = applicationsCount - applicationsByStatus[APPLICATION_STATUS.REJECTED] - applicationsByStatus[APPLICATION_STATUS.WITHDRAWN];
    const successRate = applicationsCount > 0 
      ? Math.round((applicationsByStatus[APPLICATION_STATUS.SELECTED] / applicationsCount) * 100) 
      : 0;

    return {
      profile: {
        completeness,
        skillCount: student.skills?.length || 0,
        projectCount: student.projects?.length || 0,
        certificationCount: student.certifications?.length || 0,
        hasPrimaryResume: !!primaryResume,
      },
      applications: {
        total: applicationsCount,
        active: activeApplications,
        byStatus: applicationsByStatus,
        interviews: applicationsByStatus[APPLICATION_STATUS.INTERVIEW],
        shortlisted: applicationsByStatus[APPLICATION_STATUS.SHORTLISTED],
        selected: applicationsByStatus[APPLICATION_STATUS.SELECTED],
        rejected: applicationsByStatus[APPLICATION_STATUS.REJECTED],
        successRate,
      }
    };
  }

  // ============================================================================
  // STAGE C: RECRUITER / COMPANY ANALYTICS
  // ============================================================================
  static async getCompanyAnalytics(companyId, tenantId) {
    const jobs = await Job.find({ companyId, tenantId }).lean();
    
    let totalJobs = jobs.length;
    let publishedJobs = 0;
    let closedJobs = 0;
    
    jobs.forEach(job => {
      if (job.status === 'PUBLISHED') publishedJobs++;
      if (job.status === 'CLOSED') closedJobs++;
    });

    const applications = await Application.find({ companyId, tenantId }).lean();
    
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
      ? Math.round((applicationsByStatus[APPLICATION_STATUS.SELECTED] / applicationsCount) * 100) 
      : 0;

    return {
      jobs: {
        total: totalJobs,
        published: publishedJobs,
        closed: closedJobs
      },
      applications: {
        total: applicationsCount,
        byStatus: applicationsByStatus,
        shortlisted: applicationsByStatus[APPLICATION_STATUS.SHORTLISTED],
        interviews: applicationsByStatus[APPLICATION_STATUS.INTERVIEW],
        selected: applicationsByStatus[APPLICATION_STATUS.SELECTED],
        rejected: applicationsByStatus[APPLICATION_STATUS.REJECTED],
        conversionRate
      }
    };
  }

  // ============================================================================
  // STAGE D: COLLEGE / PLACEMENT ANALYTICS
  // ============================================================================
  static async getTenantAnalytics(tenantId) {
    // 1. Students
    const totalStudents = await Student.countDocuments({ tenantId });
    
    // 2. Companies & Jobs
    const totalCompanies = await Company.countDocuments({ tenantId });
    const totalJobs = await Job.countDocuments({ tenantId, status: 'PUBLISHED' });
    
    // 3. Applications
    const applications = await Application.find({ tenantId }).lean();
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
