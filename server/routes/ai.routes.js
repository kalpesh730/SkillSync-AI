import express from 'express';
import {
  getATSScore,
  getSkillGap,
  getJobMatch,
  getCareerRecommendations
} from '../controllers/ai.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// AI routes are currently strictly for students analyzing their own profile against jobs
router.use(authenticate);
router.use(authorize(ROLES.STUDENT));

router.get('/ats-score/:jobId', getATSScore);
router.get('/skill-gap/:jobId', getSkillGap);
router.get('/job-match/:jobId', getJobMatch);
router.get('/career-recommendations', getCareerRecommendations);

export default router;
