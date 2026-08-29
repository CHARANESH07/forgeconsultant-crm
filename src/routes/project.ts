import { Router } from 'express';
import * as projectController from '@/controllers/project';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { projectSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(projectSchemas.create), projectController.createProject);
router.get('/', validateQuery(paginationSchema), projectController.listProjects);
router.get('/:id', validateParams(idParamSchema), projectController.getProject);
router.put('/:id', validateParams(idParamSchema), validateBody(projectSchemas.update), projectController.updateProject);
router.delete('/:id', validateParams(idParamSchema), projectController.deleteProject);

export default router;