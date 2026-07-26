import express from 'express';
import { updateSkill, deleteSkill, reorderSkills } from '../controllers/skill.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';
import { validateRequest } from '../validators/common.validator.js';
import { updateSkillSchema, reorderSkillsSchema } from '../validators/skill.validator.js';

const router = express.Router();

router.use(authenticate);

// Skill reordering route (needs to be defined before /:skillId so it doesn't get matched as an ID)
router.patch('/reorder', authorize(ROLES.STUDENT), validateRequest(reorderSkillsSchema), reorderSkills);

// Only the student and admins can update or delete skill records
router.put('/:skillId', authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), validateRequest(updateSkillSchema), updateSkill);
router.delete('/:skillId', authorize(ROLES.STUDENT, ROLES.COLLEGE_ADMIN, ROLES.SUPER_ADMIN), deleteSkill);

export default router;
