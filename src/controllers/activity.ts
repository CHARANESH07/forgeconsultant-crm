import { Response } from 'express';
import { ActivityService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { activityFieldMap, mapKeys } from '@/utils/mappers';

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

export const createActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ActivityService(getServiceContext(req));
  const activity = await service.create(mapKeys(req.body, activityFieldMap));
  res.status(201).json({ success: true, data: activity });
});

export const listActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ActivityService(getServiceContext(req));
  const { page, limit, type, entityType, search } = req.query;
  const where: any = {};
  if (type) where.type = type;
  if (entityType) where.entity_type = entityType;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 50 },
  });
  res.json({ success: true, ...result });
});

export const getEntityActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ActivityService(getServiceContext(req));
  const { entityType, entityId, page, limit } = req.query;
  if (!entityType || !entityId) return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'entityType and entityId required' } });
  const result = await service.findByEntity(entityType as string, entityId as string, { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 50 });
  res.json({ success: true, ...result });
});

export const getRecentActivity = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ActivityService(getServiceContext(req));
  const { limit } = req.query;
  const activities = await service.getRecent(parseInt(limit as string) || 20);
  res.json({ success: true, data: activities });
});