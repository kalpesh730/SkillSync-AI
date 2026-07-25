import { z } from 'zod';
import { REGEX } from '../constants/index.js';

export const updateStudentProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    phone: z.string().regex(REGEX.PHONE, 'Invalid phone format').optional().or(z.literal('')),
    usn: z.string().optional().or(z.literal('')),
    rollNumber: z.string().optional().or(z.literal('')),
    branch: z.string().optional().or(z.literal('')),
    semester: z.number().min(1).max(10).optional(),
    section: z.string().optional().or(z.literal('')),
    gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
    dateOfBirth: z.string().datetime().optional().or(z.literal('')),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
  }),
});
