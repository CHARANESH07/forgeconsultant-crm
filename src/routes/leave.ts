import { Router } from 'express';
import * as leaveController from '@/controllers/leave';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { leaveSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(leaveSchemas.create), leaveController.createLeave);
router.get('/', validateQuery(paginationSchema), leaveController.listLeaves);
router.get('/:id', validateParams(idParamSchema), leaveController.getLeave);
router.post('/:id/approve', validateParams(idParamSchema), validateBody(leaveSchemas.update), leaveController.approveLeave);
router.post('/:id/reject', validateParams(idParamSchema), validateBody(leaveSchemas.update), leaveController.rejectLeave);

export default router;