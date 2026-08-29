import { Router } from 'express';
import * as activityController from '@/controllers/activity';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateQuery } from '@/middleware/validation';
import { activitySchemas, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(activitySchemas.create), activityController.createActivity);
router.get('/', validateQuery(paginationSchema), activityController.listActivities);
router.get('/entity', activityController.getEntityActivities);
router.get('/recent', activityController.getRecentActivity);

export default router;