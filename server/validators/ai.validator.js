import { z } from 'zod';

export const atsScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  skillsScore: z.number().min(0).max(100),
  experienceScore: z.number().min(0).max(100),
  educationScore: z.number().min(0).max(100),
  projectScore: z.number().min(0).max(100),
  keywordScore: z.number().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string())
});

export const skillGapSchema = z.object({
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  partiallyMatchedSkills: z.array(z.string()),
  skillGapPercentage: z.number().min(0).max(100),
  prioritySkills: z.array(z.string()),
  recommendedLearningAreas: z.array(z.string())
});

export const jobMatchSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  reasons: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendation: z.string()
});

export const careerRecommendationsSchema = z.object({
  careerDirection: z.string(),
  recommendedSkills: z.array(z.string()),
  recommendedProjects: z.array(z.string()),
  recommendedJobTypes: z.array(z.string()),
  resumeImprovements: z.array(z.string()),
  interviewPreparationAreas: z.array(z.string()),
  priorityActions: z.array(z.string())
});
