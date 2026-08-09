import { z } from 'zod';
import { APPLICATION_STATUS } from '../constants/application.constants.js';

export const applyToJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  resumeId: z.string().min(1, 'Resume ID is required'),
  coverLetter: z.string().max(2000, 'Cover letter cannot exceed 2000 characters').optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(Object.values(APPLICATION_STATUS), {
    errorMap: () => ({ message: 'Invalid application status' }),
  }),
});

export const updateRecruiterNotesSchema = z.object({
  notes: z.string().max(5000, 'Notes cannot exceed 5000 characters').optional(),
});
