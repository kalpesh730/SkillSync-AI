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
import {
  addSkill,
  getMySkills,
  getStudentSkillsById
} from '../controllers/skill.controller.js';
import {
  addProject,
  getMyProjects,
  getStudentProjectsById
} from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateStudentProfileSchema } from '../validators/student.validator.js';
import { educationSchema } from '../validators/education.validator.js';
import { skillSchema } from '../validators/skill.validator.js';
import { projectSchema } from '../validators/project.validator.js';

const router = express.Router();

router.use(authenticate);

// Student self-service routes
router.get('/me', authorize(ROLES.STUDENT), getMyProfile);
router.put('/me', authorize(ROLES.STUDENT), validateRequest(updateStudentProfileSchema), updateMyProfile);
router.patch('/me/avatar', authorize(ROLES.STUDENT), updateAvatar);
router.get('/me/education', authorize(ROLES.STUDENT), getMyEducation);
router.post('/me/education', authorize(ROLES.STUDENT), validateRequest(educationSchema), addEducation);
router.get('/me/skills', authorize(ROLES.STUDENT), getMySkills);
router.post('/me/skills', authorize(ROLES.STUDENT), validateRequest(skillSchema), addSkill);
router.get('/me/projects', authorize(ROLES.STUDENT), getMyProjects);
router.post('/me/projects', authorize(ROLES.STUDENT), validateRequest(projectSchema), addProject);

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

router.get(
  '/:id/skills',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.RECRUITER),
  getStudentSkillsById
);

router.get(
  '/:id/projects',
  authorize(ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.RECRUITER),
  getStudentProjectsById
);

export default router;
