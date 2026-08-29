import { Router } from 'express';
import * as employeeController from '@/controllers/employee';
import { authenticateToken, requireRole } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { employeeSchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', requireRole('SUPER_ADMIN', 'ADMIN'), validateBody(employeeSchemas.create), employeeController.createEmployee);
router.get('/', validateQuery(paginationSchema), employeeController.listEmployees);
router.get('/search', validateQuery(paginationSchema), employeeController.searchEmployees);
router.get('/:id', validateParams(idParamSchema), employeeController.getEmployee);
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'), validateParams(idParamSchema), validateBody(employeeSchemas.update), employeeController.updateEmployee);
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN'), validateParams(idParamSchema), employeeController.deleteEmployee);

export default router;