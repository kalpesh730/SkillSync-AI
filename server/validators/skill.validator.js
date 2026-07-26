import { z } from 'zod';
import { SKILL_CATEGORIES, SKILL_PROFICIENCY } from '../constants/skill.constants.js';

export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Skill name is required').max(100, 'Skill name is too long'),
    category: z.enum(SKILL_CATEGORIES, {
      errorMap: () => ({ message: 'Invalid skill category' }),
    }),
    proficiency: z.enum(SKILL_PROFICIENCY, {
      errorMap: () => ({ message: 'Invalid skill proficiency' }),
    }),
    yearsOfExperience: z.number().min(0, 'Experience cannot be negative').default(0),
    lastUsed: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime()) && date <= new Date();
      }, {
        message: 'lastUsed cannot be a future date',
      }),
    displayOrder: z.number().min(0).optional(),
    verified: z.boolean().optional(),
    verificationSource: z.string().optional(),
    certificationId: z.string().optional(),
    aiScore: z.number().min(0).max(100).nullable().optional(),
  }),
});

export const updateSkillSchema = z.object({
  body: skillSchema.shape.body.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  }),
});

export const reorderSkillsSchema = z.object({
  body: z.object({
    skills: z.array(
      z.object({
        skillId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID format'),
        displayOrder: z.number().min(0),
      })
    ).min(1, 'At least one skill is required for reordering'),
  }),
});
