import { z } from 'zod';
import { EMPLOYMENT_TYPE, WORKPLACE_TYPE } from '../constants/job.constants.js';

export const jobSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  title: z.string().min(2, 'Job title must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  employmentType: z.enum(EMPLOYMENT_TYPE, { errorMap: () => ({ message: 'Invalid employment type' }) }),
  workplaceType: z.enum(WORKPLACE_TYPE, { errorMap: () => ({ message: 'Invalid workplace type' }) }),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  experienceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  salaryRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().optional(),
  }).optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  educationRequirements: z.array(z.string()).optional(),
  openings: z.number().min(1).optional(),
  applicationDeadline: z.string().datetime().optional().or(z.date().optional()),
});
