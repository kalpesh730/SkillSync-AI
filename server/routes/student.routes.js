import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getStudentById,
  getAllStudents,
  updateAvatar,
} from '../controllers/student.controller.js';
import {
  addEducation,
  getMyEducation,
  getStudentEducationById
} from '../controllers/education.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateStudentProfileSchema } from '../validators/student.validator.js';
import { educationSchema } from '../validators/education.validator.js';

const router = express.Router();

router.use(authenticate);

// Student self-service routes
router.get('/me', authorize(ROLES.STUDENT), getMyProfile);
router.put('/me', authorize(ROLES.STUDENT), validateRequest(updateStudentProfileSchema), updateMyProfile);
router.patch('/me/avatar', authorize(ROLES.STUDENT), updateAvatar);
router.get('/me/education', authorize(ROLES.STUDENT), getMyEducation);
router.post('/me/education', authorize(ROLES.STUDENT), validateRequest(educationSchema), addEducation);

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

router.get(
  '/:id/education',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.RECRUITER),
  getStudentEducationById
);

export default router;
