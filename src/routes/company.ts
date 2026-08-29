import { Router } from 'express';
import * as companyController from '@/controllers/company';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { companySchemas, idParamSchema, paginationSchema } from '@/validators';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(companySchemas.create), companyController.createCompany);
router.get('/', validateQuery(paginationSchema), companyController.listCompanies);
router.get('/stats', companyController.getCompanyStats);
router.get('/:id', validateParams(idParamSchema), companyController.getCompany);
router.put('/:id', validateParams(idParamSchema), validateBody(companySchemas.update), companyController.updateCompany);
router.delete('/:id', validateParams(idParamSchema), companyController.deleteCompany);

export default router;