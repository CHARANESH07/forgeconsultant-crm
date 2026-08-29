import { Response } from 'express';
import { DealService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { dealFieldMap, mapKeys } from '@/utils/mappers';

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

export const createDeal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  const deal = await service.create(mapKeys(req.body, dealFieldMap));
  res.status(201).json({ success: true, data: deal });
});

export const getDeal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  const deal = await service.findById(req.params.id);
  if (!deal) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
  res.json({ success: true, data: deal });
});

export const listDeals = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  const { page, limit, stage, serviceType, search } = req.query;
  const where: any = {};
  if (stage && stage !== 'all') where.stage = stage;
  if (serviceType) where.service_type = serviceType;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { contact_name: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateDeal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  const deal = await service.update(req.params.id, mapKeys(req.body, dealFieldMap));
  res.json({ success: true, data: deal });
});

export const deleteDeal = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Deal deleted' });
});

export const moveDealStage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  const deal = await service.moveStage(req.params.id, req.body.stage);
  res.json({ success: true, data: deal });
});

export const getPipelineStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DealService(getServiceContext(req));
  const stats = await service.getPipelineStats();
  res.json({ success: true, data: stats });
});