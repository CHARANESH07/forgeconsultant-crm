import { Response } from 'express';
import { CompanyService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { companyFieldMap, mapKeys } from '@/utils/mappers';

function getServiceContext(req: AuthenticatedRequest): ServiceContext {
  const user = req.user!;
  return {
    userId: user.userId,
    userRole: user.role,
    userEmail: user.email,
    userName: user.full_name || user.email,
    organizationId: user.organizationId,
    employeeId: user.employeeId,
    crmRole: user.crmRole,
    isSuperior: user.isSuperior,
  };
}

export const createCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new CompanyService(getServiceContext(req));
  const company = await service.create(mapKeys(req.body, companyFieldMap));
  res.status(201).json({ success: true, data: company });
});

export const getCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new CompanyService(getServiceContext(req));
  const company = await service.findById(req.params.id);
  if (!company) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Company not found' } });
  res.json({ success: true, data: company });
});

export const listCompanies = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new CompanyService(getServiceContext(req));
  const { page, limit, tier, search } = req.query;
  const where: any = {};
  if (tier && tier !== 'all') where.tier = tier;
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { industry: { contains: search as string, mode: 'insensitive' } },
      { city: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new CompanyService(getServiceContext(req));
  const company = await service.update(req.params.id, mapKeys(req.body, companyFieldMap));
  res.json({ success: true, data: company });
});

export const deleteCompany = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new CompanyService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Company deleted' });
});

export const getCompanyStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new CompanyService(getServiceContext(req));
  const stats = await service.getStats();
  res.json({ success: true, data: stats });
});