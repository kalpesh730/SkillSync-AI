import express from 'express';
import {
  createCompany,
  getCompany,
  getCompanies,
  updateCompany,
  deleteCompany
} from '../controllers/company.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { validateRequest } from '../validators/common.validator.js';
import { companySchema } from '../validators/company.validator.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// All company routes require authentication
router.use(authenticate);

// Get all companies (Accessible by SUPER_ADMIN, COLLEGE_ADMIN, PLACEMENT_OFFICER, STUDENT, COMPANY_HR, RECRUITER)
router.get(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.STUDENT, ROLES.COMPANY_HR, ROLES.RECRUITER),
  getCompanies
);

// Get single company details
router.get(
  '/:companyId',
  authorize(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.STUDENT, ROLES.COMPANY_HR, ROLES.RECRUITER),
  getCompany
);

// Create a new company
router.post(
  '/',
  authorize(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  validateRequest(companySchema),
  createCompany
);

// Update a company
router.put(
  '/:companyId',
  authorize(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  validateRequest(companySchema),
  updateCompany
);

// Delete (soft-delete) a company
router.delete(
  '/:companyId',
  authorize(ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.COMPANY_HR, ROLES.RECRUITER),
  deleteCompany
);

export default router;
