import express from 'express';
import {
  applyToJob,
  getApplication,
  getMyApplications,
  getJobApplications,
  getCompanyApplications,
  updateApplicationStatus,
  updateRecruiterNotes
} from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { applyToJobSchema, updateApplicationStatusSchema, updateRecruiterNotesSchema } from '../validators/application.validator.js';
import { ROLES } from '../constants/index.js';
import { requireTenantContext } from '../middlewares/tenant.middleware.js';

const router = express.Router();

router.use(authenticate);

// Student routes
router.post(
  '/',
  authorize(ROLES.STUDENT),
  requireTenantContext,
  validateRequest(applyToJobSchema),
  applyToJob
);

router.get(
  '/me',
  authorize(ROLES.STUDENT),
  requireTenantContext,
  getMyApplications
);

// Recruiter / HR routes for job/company scope
router.get(
  '/job/:jobId',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  getJobApplications
);

router.get(
  '/company/:companyId',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  getCompanyApplications
);

// Shared / Specific Application Routes
router.get(
  '/:applicationId',
  authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  requireTenantContext,
  getApplication
);

router.patch(
  '/:applicationId/status',
  authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  requireTenantContext,
  validateRequest(updateApplicationStatusSchema),
  updateApplicationStatus
);

router.patch(
  '/:applicationId/notes',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  validateRequest(updateRecruiterNotesSchema),
  updateRecruiterNotes
);

export default router;
