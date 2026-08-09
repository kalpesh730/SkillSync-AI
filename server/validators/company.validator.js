import { z } from 'zod';
import { COMPANY_SIZES } from '../constants/company.constants.js';

export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  legalName: z.string().max(100).optional(),
  industry: z.string().min(2, 'Industry must be at least 2 characters').max(100),
  companySize: z.enum(COMPANY_SIZES, {
    errorMap: () => ({ message: 'Invalid company size' }),
  }),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(2, 'City must be at least 2 characters').max(50),
    state: z.string().min(2, 'State must be at least 2 characters').max(50),
    country: z.string().min(2, 'Country must be at least 2 characters').max(50),
    zipCode: z.string().optional(),
  }).optional(),
  contactInfo: z.object({
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  }).optional(),
});
