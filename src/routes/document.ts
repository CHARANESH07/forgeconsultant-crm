import { Router } from 'express';
import * as documentController from '@/controllers/document';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { documentSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(documentSchemas.create), documentController.createDocument);
router.get('/', validateQuery(paginationSchema), documentController.listDocuments);
router.get('/:id', validateParams(idParamSchema), documentController.getDocument);
router.put('/:id', validateParams(idParamSchema), validateBody(documentSchemas.update), documentController.updateDocument);
router.delete('/:id', validateParams(idParamSchema), documentController.deleteDocument);

export default router;