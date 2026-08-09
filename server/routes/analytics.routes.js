import express from 'express';
import {
  getStudentAnalytics,
  getRecruiterAnalytics,
  getTenantAnalytics
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

router.use(authenticate);

// Student Analytics
router.get('/student', authorize(ROLES.STUDENT), getStudentAnalytics);

// Recruiter/Company Analytics
router.get('/company', authorize(ROLES.COMPANY_HR, ROLES.RECRUITER), getRecruiterAnalytics);

// College/Tenant Analytics
router.get('/tenant', authorize(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER), getTenantAnalytics);

export default router;
