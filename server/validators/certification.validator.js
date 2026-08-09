import { z } from 'zod';

const baseBody = z.object({
  name: z.string().min(1, 'Certification name is required').max(150, 'Certification name is too long'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required').max(150, 'Issuing organization name is too long'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional().or(z.literal('')),
  credentialId: z.string().optional().or(z.literal('')),
  credentialUrl: z.string().url('Invalid credential URL').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
});

export const certificationSchema = z.object({
  body: baseBody.refine((data) => {
    if (data.issueDate && data.expiryDate) {
      const start = new Date(data.issueDate);
      const end = new Date(data.expiryDate);
      return start <= end;
    }
    return true;
  }, {
    message: 'Issue date cannot be greater than expiry date',
    path: ['expiryDate'],
  })
});

export const updateCertificationSchema = z.object({
  body: baseBody.partial().refine((data) => {
    if (data.issueDate && data.expiryDate) {
      const start = new Date(data.issueDate);
      const end = new Date(data.expiryDate);
      return start <= end;
    }
    return true;
  }, {
    message: 'Issue date cannot be greater than expiry date',
    path: ['expiryDate'],
  })
});
