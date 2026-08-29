import { Router } from 'express';
import * as leadController from '@/controllers/lead';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { leadSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(leadSchemas.create), leadController.createLead);
router.get('/', validateQuery(paginationSchema), leadController.listLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/:id', validateParams(idParamSchema), leadController.getLead);
router.put('/:id', validateParams(idParamSchema), validateBody(leadSchemas.update), leadController.updateLead);
router.delete('/:id', validateParams(idParamSchema), leadController.deleteLead);
router.post('/:id/convert', validateParams(idParamSchema), validateBody(leadSchemas.convert), leadController.convertLead);

export default router;