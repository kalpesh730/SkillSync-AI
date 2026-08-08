import { z } from 'zod';
import { PROJECT_TYPES } from '../constants/project.constants.js';

const baseBody = z.object({
  title: z.string().min(1, 'Project title is required').max(150, 'Project title is too long'),
  description: z.string().optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid Live URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Invalid Image URL').optional().or(z.literal('')),
  projectType: z.enum(PROJECT_TYPES).optional(),
  teamSize: z.number().min(1, 'Team size must be at least 1').optional(),
  role: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  currentlyWorking: z.boolean().optional(),
  displayOrder: z.number().min(0).optional(),
  aiSummary: z.string().optional().or(z.literal('')),
  complexityScore: z.number().min(0).max(100).optional(),
  featured: z.boolean().optional(),
  recruiterVisible: z.boolean().optional(),
});

export const projectSchema = z.object({
  body: baseBody.refine((data) => {
    if (data.startDate && data.endDate && !data.currentlyWorking) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    }
    return true;
  }, {
    message: 'Start date cannot be greater than end date',
    path: ['endDate'],
  })
});

export const updateProjectSchema = z.object({
  body: baseBody.partial().refine((data) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    }
    return true;
  }, {
    message: 'Start date cannot be greater than end date',
    path: ['endDate'],
  })
});
