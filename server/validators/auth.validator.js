import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(
    ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'STUDENT', 'COMPANY_HR', 'RECRUITER'],
    {
      errorMap: () => ({ message: 'Invalid role provided' }),
    }
  ).optional().default('STUDENT'),
  tenantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid tenant ID').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});
