import { Router } from 'express';
import authRoutes from './auth';
import streamRoutes from './streams';
import studentRoutes from './students';
import subjectRoutes from './subjects';
import assessmentRoutes from './assessments';
import scoreRoutes from './scores';
import resultRoutes from './results';
import reportRoutes from './reports';
import analyticsRoutes from './analytics';

const router = Router();

router.use('/auth', authRoutes);
router.use('/streams', streamRoutes);
router.use('/students', studentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/scores', scoreRoutes);
router.use('/results', resultRoutes);
router.use('/reports', reportRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
