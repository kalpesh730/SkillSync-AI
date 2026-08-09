import { z } from 'zod';
import { RESUME_FILE_TYPES } from '../constants/resume.constants.js';

export const uploadResumeMetadataSchema = z.object({
  body: z.object({
    originalFileName: z.string().min(1, 'File name is required').max(255),
    fileType: z.enum(RESUME_FILE_TYPES, {
      errorMap: () => ({ message: 'Invalid file type. Only PDF, DOC, and DOCX are supported.' }),
    }),
    fileSize: z.number().positive('File size must be positive').max(10 * 1024 * 1024, 'File size must be under 10MB'),
    isPrimary: z.boolean().optional(),
    base64File: z.string().min(1, 'File data is required'),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    isPrimary: z.boolean().optional(),
  }),
});
