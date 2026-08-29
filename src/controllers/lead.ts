import { Response } from 'express';
import { LeadService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { leadFieldMap, mapKeys } from '@/utils/mappers';

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

export const createLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  const lead = await service.create(mapKeys(req.body, leadFieldMap));
  res.status(201).json({ success: true, data: lead });
});

export const getLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  const lead = await service.findById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } });
  res.json({ success: true, data: lead });
});

export const listLeads = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  const { page, limit, sortBy, sortOrder, status, search } = req.query;
  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { first_name: { contains: search as string, mode: 'insensitive' } },
      { last_name: { contains: search as string, mode: 'insensitive' } },
      { company_name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20, sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc' },
  });
  res.json({ success: true, ...result });
});

export const updateLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  const lead = await service.update(req.params.id, mapKeys(req.body, leadFieldMap));
  res.json({ success: true, data: lead });
});

export const deleteLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Lead deleted' });
});

export const convertLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  const result = await service.convert(req.params.id, req.body);
  res.json({ success: true, data: result });
});

export const getLeadStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeadService(getServiceContext(req));
  const stats = await service.getStats();
  res.json({ success: true, data: stats });
});