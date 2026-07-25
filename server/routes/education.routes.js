import express from 'express';
import { updateEducation, deleteEducation } from '../controllers/education.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateEducationSchema } from '../validators/education.validator.js';

const router = express.Router();

router.use(authenticate);

// Only the student can update or delete their own education records via these endpoints
router.put('/:educationId', authorize(ROLES.STUDENT), validateRequest(updateEducationSchema), updateEducation);
router.delete('/:educationId', authorize(ROLES.STUDENT), deleteEducation);

export default router;
