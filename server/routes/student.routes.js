import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getStudentById,
  getAllStudents,
  updateAvatar,
} from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateStudentProfileSchema } from '../validators/student.validator.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', authorize(ROLES.STUDENT), getMyProfile);
router.put('/me', authorize(ROLES.STUDENT), validateRequest(updateStudentProfileSchema), updateMyProfile);
router.patch('/me/avatar', authorize(ROLES.STUDENT), updateAvatar);

router.get(
  '/',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.RECRUITER),
  getAllStudents
);

router.get(
  '/:id',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.RECRUITER),
  getStudentById
);

export default router;
