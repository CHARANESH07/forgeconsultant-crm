import { Router } from 'express';
import * as attendanceController from '@/controllers/attendance';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { attendanceSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/check-in', validateBody(attendanceSchemas.checkIn), attendanceController.checkIn);
router.post('/check-out', validateParams(idParamSchema), validateBody(attendanceSchemas.checkOut), attendanceController.checkOut);
router.get('/', validateQuery(paginationSchema), attendanceController.listAttendance);
router.get('/today', attendanceController.getTodayAttendance);

export default router;