import { Router } from 'express';
import * as notificationController from '@/controllers/notification';
import { authenticateToken } from '@/middleware/auth';
import { validateParams, validateQuery } from '@/middleware/validation';
import { paginationSchema, idParamSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.get('/', validateQuery(paginationSchema), notificationController.listNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.post('/:id/read', validateParams(idParamSchema), notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

export default router;