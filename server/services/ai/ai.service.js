import { GeminiService } from './gemini.service.js';
import { AI_PROMPTS } from './prompts.js';
import { 
  atsScoreSchema, 
  skillGapSchema, 
  jobMatchSchema, 
  careerRecommendationsSchema 
} from '../../validators/ai.validator.js';
import { StudentService } from '../student.service.js';
import { ResumeService } from '../resume.service.js';
import { JobService } from '../job.service.js';
import { ApplicationService } from '../application.service.js';
import { ROLES } from '../../constants/index.js';

export class AIService {
  static async _getStudentContext(studentId, tenantId) {
    const student = await StudentService.getStudentById(studentId, tenantId);
    let primaryResume = null;
    
    // We can't access req.user here directly, so we bypass strict role check or construct a mock user 
    // Since this is internal service-to-service, we might need a direct DB call or a modified service method.
    // Let's use the ResumeService to get resumes
    const resumes = await ResumeService.getResumesByStudent(studentId, tenantId);
    if (resumes && resumes.length > 0) {
      primaryResume = resumes.find(r => r.isPrimary) || resumes[0];
    }

    return {
      profile: student.profile,
      skills: student.skills,
      education: student.education,
      projects: student.projects,
      certifications: student.certifications,
      resumeParsedData: primaryResume ? primaryResume.parsedData : null,
    };
  }

  static async getATSScore(studentId, jobId, tenantId) {
    const studentContext = await this._getStudentContext(studentId, tenantId);
    
    // For internal AI, we bypass the strict user RBAC by passing a mock user with STUDENT role
    const mockUser = { _id: studentId, role: ROLES.STUDENT, tenantId };
    const job = await JobService.getJobById(jobId, tenantId, ROLES.STUDENT, null);

    const inputData = {
      student: studentContext,
      job: {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        experienceLevel: job.experienceLevel,
      }
    };

    const result = await GeminiService.generateStructuredContent(AI_PROMPTS.ATS_SCORE, inputData);
    
    if (!result) return null; // Graceful degradation

    try {
      return atsScoreSchema.parse(result);
    } catch (error) {
      console.error('AIService: ATS Score Validation Error', error);
      return null;
    }
  }

  static async getSkillGap(studentId, jobId, tenantId) {
    const studentContext = await this._getStudentContext(studentId, tenantId);
    const job = await JobService.getJobById(jobId, tenantId, ROLES.STUDENT, null);

    const inputData = {
      studentSkills: studentContext.skills,
      resumeSkills: studentContext.resumeParsedData?.skills || [],
      jobRequirements: {
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
      }
    };

    const result = await GeminiService.generateStructuredContent(AI_PROMPTS.SKILL_GAP, inputData);
    
    if (!result) return null;

    try {
      return skillGapSchema.parse(result);
    } catch (error) {
      console.error('AIService: Skill Gap Validation Error', error);
      return null;
    }
  }

  static async getJobMatch(studentId, jobId, tenantId) {
    const studentContext = await this._getStudentContext(studentId, tenantId);
    const job = await JobService.getJobById(jobId, tenantId, ROLES.STUDENT, null);

    const inputData = {
      student: studentContext,
      job: {
        title: job.title,
        requirements: job.requirements,
        requiredSkills: job.requiredSkills,
      }
    };

    const result = await GeminiService.generateStructuredContent(AI_PROMPTS.JOB_MATCH, inputData);
    
    if (!result) return null;

    try {
      return jobMatchSchema.parse(result);
    } catch (error) {
      console.error('AIService: Job Match Validation Error', error);
      return null;
    }
  }

  static async getCareerRecommendations(studentId, tenantId) {
    const studentContext = await this._getStudentContext(studentId, tenantId);
    
    // We can fetch their applications to provide more context
    const mockUser = { _id: studentId, role: ROLES.STUDENT, tenantId };
    const applications = await ApplicationService.getStudentApplications(studentId, tenantId, mockUser);
    
    const appSummary = applications.map(app => ({
      jobTitle: app.jobId?.title,
      status: app.status
    }));

    const inputData = {
      student: studentContext,
      applicationHistory: appSummary
    };

    const result = await GeminiService.generateStructuredContent(AI_PROMPTS.CAREER_RECOMMENDATIONS, inputData);
    
    if (!result) return null;

    try {
      return careerRecommendationsSchema.parse(result);
    } catch (error) {
      console.error('AIService: Career Recs Validation Error', error);
      return null;
    }
  }
}
