import { z } from 'zod';
import mongoose from 'mongoose';
import { REGEX } from '../constants/index.js';

export const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format',
});

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  sort: z.string().optional(),
  fields: z.string().optional(),
  search: z.string().optional(),
});

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(REGEX.PASSWORD, 'Password must contain at least one letter and one number');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .regex(REGEX.EMAIL, 'Invalid email format');

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }
    next(error);
  }
};
