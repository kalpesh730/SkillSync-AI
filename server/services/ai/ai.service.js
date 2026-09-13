import { GeminiService } from './gemini.service.js';
import { AI_PROMPTS } from './prompts.js';
import {
  atsScoreSchema,
  skillGapSchema,
  jobMatchSchema,
  careerRecommendationsSchema
} from '../../validators/ai.validator.js';
import Student from '../../models/Student.js';
import Skill from '../../models/Skill.js';
import Education from '../../models/Education.js';
import Project from '../../models/Project.js';
import Certification from '../../models/Certification.js';
import Resume from '../../models/Resume.js';
import Application from '../../models/Application.js';
import { JobService } from '../job.service.js';
import { ApplicationService } from '../application.service.js';
import { ROLES } from '../../constants/index.js';
import { NotFoundError } from '../../errors/AppError.js';

export class AIService {
  static async _getStudentContext(userOrStudentId, tenantId) {
    let student = await Student.findOne({ userId: userOrStudentId });
    if (!student) {
      student = await Student.findById(userOrStudentId);
    }
    if (!student) throw new NotFoundError('Student profile not found.');

    const studentId = student._id;

    const [skills, education, projects, certifications, primaryResume] = await Promise.all([
      Skill.find({ studentId, isDeleted: false }).sort({ order: 1 }),
      Education.find({ studentId, isDeleted: false }).sort({ endYear: -1 }),
      Project.find({ studentId, isDeleted: false }),
      Certification.find({ studentId, isDeleted: false }),
      Resume.findOne({ studentId, isDeleted: false }).sort({ isPrimary: -1, createdAt: -1 })
    ]);

    return {
      student,
      profile: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        branch: student.branch,
        semester: student.semester,
        usn: student.usn,
        profileCompletion: student.profileCompletion,
      },
      skills: skills.map(s => s.name),
      education: education.map(e => ({
        institution: e.institutionName,
        degree: e.degree,
        specialization: e.specialization,
        educationLevel: e.educationLevel,
        cgpa: e.cgpa,
        percentage: e.percentage,
        passingYear: e.passingYear,
        status: e.status
      })),
      projects: projects.map(p => ({
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        projectUrl: p.projectUrl
      })),
      certifications: certifications.map(c => ({
        name: c.name,
        issuingOrganization: c.issuingOrganization,
        issueDate: c.issueDate
      })),
      resumeParsedData: primaryResume ? primaryResume.parsedData : null,
    };
  }

  static async getATSScore(userOrStudentId, jobId, tenantId) {
    const studentContext = await this._getStudentContext(userOrStudentId, tenantId);
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

    if (result) {
      try {
        return atsScoreSchema.parse(result);
      } catch (error) {
        console.error('AIService: ATS Score Validation Error', error);
      }
    }

    // Fallback ATS score calculation
    const studentSkills = new Set((studentContext.skills || []).map(s => s.toLowerCase()));
    if (studentContext.resumeParsedData?.skills) {
      studentContext.resumeParsedData.skills.forEach(s => studentSkills.add(s.toLowerCase()));
    }

    const requiredSkills = job.requiredSkills || [];
    const matched = requiredSkills.filter(s => studentSkills.has(s.toLowerCase()));
    const missing = requiredSkills.filter(s => !studentSkills.has(s.toLowerCase()));
    const ratio = requiredSkills.length > 0 ? (matched.length / requiredSkills.length) : 0.7;
    const overallScore = Math.min(100, Math.max(20, Math.round(ratio * 100)));

    return {
      overallScore,
      skillsScore: overallScore,
      experienceScore: Math.round(overallScore * 0.9),
      educationScore: 85,
      projectScore: (studentContext.projects && studentContext.projects.length > 0) ? 80 : 40,
      keywordScore: overallScore,
      matchedSkills: matched,
      missingSkills: missing,
      strengths: ['Relevant educational background', `${matched.length} key skill requirements satisfied`],
      weaknesses: missing.length > 0 ? [`Missing required skills: ${missing.slice(0, 3).join(', ')}`] : [],
      recommendations: [
        'Add targeted keywords from the job description to your profile',
        'Highlight projects demonstrating core technical competencies'
      ]
    };
  }

  static async getSkillGap(userOrStudentId, jobId, tenantId) {
    const studentContext = await this._getStudentContext(userOrStudentId, tenantId);
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

    if (result) {
      try {
        return skillGapSchema.parse(result);
      } catch (error) {
        console.error('AIService: Skill Gap Validation Error', error);
      }
    }

    const studentSkills = new Set((studentContext.skills || []).map(s => s.toLowerCase()));
    const requiredSkills = job.requiredSkills || [];
    const matched = requiredSkills.filter(s => studentSkills.has(s.toLowerCase()));
    const missing = requiredSkills.filter(s => !studentSkills.has(s.toLowerCase()));
    const gap = requiredSkills.length > 0 ? Math.round((missing.length / requiredSkills.length) * 100) : 30;

    return {
      matchedSkills: matched,
      missingSkills: missing,
      partiallyMatchedSkills: [],
      skillGapPercentage: gap,
      prioritySkills: missing.slice(0, 4),
      recommendedLearningAreas: missing.map(s => `Master ${s} fundamentals and build a working demo`)
    };
  }

  static async getJobMatch(userOrStudentId, jobId, tenantId) {
    const studentContext = await this._getStudentContext(userOrStudentId, tenantId);
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

    if (result) {
      try {
        return jobMatchSchema.parse(result);
      } catch (error) {
        console.error('AIService: Job Match Validation Error', error);
      }
    }

    const studentSkills = new Set((studentContext.skills || []).map(s => s.toLowerCase()));
    const requiredSkills = job.requiredSkills || [];
    const matched = requiredSkills.filter(s => studentSkills.has(s.toLowerCase()));
    const missing = requiredSkills.filter(s => !studentSkills.has(s.toLowerCase()));
    const score = requiredSkills.length > 0 ? Math.round((matched.length / requiredSkills.length) * 100) : 75;

    return {
      matchScore: score,
      matchedSkills: matched,
      missingSkills: missing,
      reasons: [`Matches ${matched.length} core requirements`, 'Educational profile aligns with role expectations'],
      concerns: missing.length > 0 ? [`May need upskilling in: ${missing.slice(0, 3).join(', ')}`] : [],
      recommendation: score >= 60 ? 'Strong candidate profile. Recommended to apply.' : 'Consider building complementary skills before applying.'
    };
  }

  static async getCareerRecommendations(userOrStudentId, tenantId) {
    const studentContext = await this._getStudentContext(userOrStudentId, tenantId);
    const studentId = studentContext.student._id;

    let appSummary = [];
    try {
      const applications = await Application.find({ studentId, isDeleted: false }).populate('jobId', 'title');
      appSummary = applications.map(app => ({
        jobTitle: app.jobId?.title,
        status: app.status
      }));
    } catch {
      appSummary = [];
    }

    const inputData = {
      student: studentContext,
      applicationHistory: appSummary
    };

    const result = await GeminiService.generateStructuredContent(AI_PROMPTS.CAREER_RECOMMENDATIONS, inputData);

    if (result) {
      try {
        return careerRecommendationsSchema.parse(result);
      } catch (error) {
        console.error('AIService: Career Recs Validation Error', error);
      }
    }

    // Comprehensive heuristic recommendations using available student data
    const skillsList = studentContext.skills || [];
    const branch = studentContext.profile?.branch || 'Computer Science & Engineering';
    const hasData = skillsList.length > 0 || (studentContext.education && studentContext.education.length > 0) || studentContext.resumeParsedData;

    return {
      careerDirection: hasData
        ? `Based on your profile in ${branch}, your career trajectory aligns strongly with modern software engineering and technology roles. Focus on consolidating your core strengths and showcasing end-to-end practical deliverables.`
        : "Complete your profile and upload a resume to receive personalized recommendations.",
      recommendedSkills: hasData && skillsList.length > 0
        ? ['System Design', 'TypeScript', 'Docker & Containerization', 'REST & GraphQL Architecture', 'Cloud Fundamentals (AWS/GCP)']
        : ['JavaScript / Python', 'Data Structures & Algorithms', 'Git & Version Control', 'SQL & Database Design', 'Web Development Fundamentals'],
      recommendedProjects: hasData
        ? ['Full-stack enterprise dashboard with role-based authentication', 'Real-time collaborative application using WebSockets', 'Automated data extraction and indexing pipeline']
        : ['Personal Developer Portfolio Website', 'Interactive Task Management Web Application', 'E-commerce API with Database Integration'],
      recommendedJobTypes: hasData
        ? ['Software Development Engineer (SDE)', 'Full Stack Developer', 'Backend Engineer', 'Frontend Engineer']
        : ['Associate Software Engineer', 'Junior Web Developer', 'Software Engineering Intern'],
      resumeImprovements: studentContext.resumeParsedData
        ? ['Quantify project impact with measurable outcomes and percentages', 'Structure skills into categorized groups for easy scanning', 'Include active live deployment and repository URLs']
        : ['Upload your resume in PDF/DOC/DOCX format to activate ATS analysis', 'Ensure contact details, education, and GitHub links are listed'],
      interviewPreparationAreas: [
        'Core Data Structures & Algorithmic Problem Solving',
        'Database Schema Design & Query Optimization',
        'System Architecture & API Design Best Practices',
        'Behavioral Competencies & STAR Methodology'
      ],
      priorityActions: hasData
        ? [
            'Develop and deploy a full-stack portfolio capstone project',
            'Dedicate structured practice to algorithmic problem solving daily',
            'Tailor your resume for specific target company job descriptions'
          ]
        : [
            'Complete your profile details (education, skills, projects)',
            'Upload your primary resume to activate AI parsing and ATS scoring',
            'Add at least 3 core technical skills to your profile'
          ]
    };
  }
}
