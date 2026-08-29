import { Router } from 'express';
import * as taskController from '@/controllers/task';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { taskSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(taskSchemas.create), taskController.createTask);
router.get('/', validateQuery(paginationSchema), taskController.listTasks);
router.get('/:id', validateParams(idParamSchema), taskController.getTask);
router.put('/:id', validateParams(idParamSchema), validateBody(taskSchemas.update), taskController.updateTask);
router.delete('/:id', validateParams(idParamSchema), taskController.deleteTask);
router.post('/:id/toggle', validateParams(idParamSchema), taskController.toggleTaskCompletion);

export default router;