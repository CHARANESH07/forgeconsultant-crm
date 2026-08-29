import { Router } from 'express';
import * as contactController from '@/controllers/contact';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { contactSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(contactSchemas.create), contactController.createContact);
router.get('/', validateQuery(paginationSchema), contactController.listContacts);
router.get('/:id', validateParams(idParamSchema), contactController.getContact);
router.put('/:id', validateParams(idParamSchema), validateBody(contactSchemas.update), contactController.updateContact);
router.delete('/:id', validateParams(idParamSchema), contactController.deleteContact);

export default router;