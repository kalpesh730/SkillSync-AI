import express from 'express';
import {
  updateResume,
  deleteResume,
  retryParsing,
  downloadResume
} from '../controllers/resume.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { updateResumeSchema } from '../validators/resume.validator.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/:resumeId/file',
  authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.RECRUITER),
  downloadResume
);

router.put(
  '/:resumeId',
  authorize(ROLES.STUDENT),
  validateRequest(updateResumeSchema),
  updateResume
);

router.delete(
  '/:resumeId',
  authorize(ROLES.STUDENT),
  deleteResume
);

router.post(
  '/:resumeId/parse',
  authorize(ROLES.STUDENT),
  retryParsing
);

export default router;
