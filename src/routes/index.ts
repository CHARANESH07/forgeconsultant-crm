import { Router } from 'express';
import authRoutes from './auth';
import leadRoutes from './lead';
import contactRoutes from './contact';
import companyRoutes from './company';
import dealRoutes from './deal';
import taskRoutes from './task';
import projectRoutes from './project';
import employeeRoutes from './employee';
import attendanceRoutes from './attendance';
import leaveRoutes from './leave';
import documentRoutes from './document';
import activityRoutes from './activity';
import notificationRoutes from './notification';
import meetingRoutes from './meeting';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/contacts', contactRoutes);
router.use('/companies', companyRoutes);
router.use('/deals', dealRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/documents', documentRoutes);
router.use('/activities', activityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/meetings', meetingRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

export default router;