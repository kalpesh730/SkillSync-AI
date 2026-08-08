import express from 'express';
import { updateProject, deleteProject } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateProjectSchema } from '../validators/project.validator.js';

const router = express.Router();

router.use(authenticate);

// Update Project
router.put(
  '/:projectId',
  authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN),
  validateRequest(updateProjectSchema),
  updateProject
);

// Delete Project
router.delete(
  '/:projectId',
  authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN),
  deleteProject
);

export default router;
