import express from 'express';
import { updateCertification, deleteCertification } from '../controllers/certification.controller.js';
import { authenticate as requireAuth } from '../middlewares/auth.middleware.js';
import { authorize as requireRole } from '../middlewares/authorize.middleware.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateCertificationSchema } from '../validators/certification.validator.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

router.use(requireAuth);

router.put(
  '/:certificationId',
  requireRole(ROLES.STUDENT),
  validateRequest(updateCertificationSchema),
  updateCertification
);

router.delete(
  '/:certificationId',
  requireRole(ROLES.STUDENT),
  deleteCertification
);

export default router;
