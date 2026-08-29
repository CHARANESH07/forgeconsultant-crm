import { Router } from 'express';
import * as dealController from '@/controllers/deal';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { dealSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(dealSchemas.create), dealController.createDeal);
router.get('/', validateQuery(paginationSchema), dealController.listDeals);
router.get('/pipeline-stats', dealController.getPipelineStats);
router.get('/:id', validateParams(idParamSchema), dealController.getDeal);
router.put('/:id', validateParams(idParamSchema), validateBody(dealSchemas.update), dealController.updateDeal);
router.delete('/:id', validateParams(idParamSchema), dealController.deleteDeal);
router.post('/:id/stage', validateParams(idParamSchema), validateBody(dealSchemas.moveStage), dealController.moveDealStage);

export default router;