import express from 'express';
import {
  createJob,
  getJob,
  getCompanyJobs,
  getPublishedJobs,
  updateJob,
  updateJobStatus,
  deleteJob
} from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { jobSchema } from '../validators/job.validator.js';
import { ROLES } from '../constants/index.js';
import { requireTenantContext } from '../middlewares/tenant.middleware.js';

const router = express.Router();

router.use(authenticate);

// Get published jobs (Accessible by all roles)
router.get(
  '/published',
  requireTenantContext,
  getPublishedJobs
);

// Get single job
router.get(
  '/:jobId',
  requireTenantContext,
  getJob
);

// Get company jobs
router.get(
  '/company/:companyId',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  getCompanyJobs
);

// Create job
router.post(
  '/',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  validateRequest(jobSchema),
  createJob
);

// Update job
router.put(
  '/:jobId',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  validateRequest(jobSchema.partial()), // Use partial for updates
  updateJob
);

// Update job status
router.patch(
  '/:jobId/status',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  updateJobStatus
);

// Delete job
router.delete(
  '/:jobId',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  deleteJob
);

export default router;
