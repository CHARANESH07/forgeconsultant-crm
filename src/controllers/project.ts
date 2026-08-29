import { Response } from 'express';
import { ProjectService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

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

export const createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ProjectService(getServiceContext(req));
  const project = await service.create(req.body);
  res.status(201).json({ success: true, data: project });
});

export const getProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ProjectService(getServiceContext(req));
  const project = await service.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
  res.json({ success: true, data: project });
});

export const listProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ProjectService(getServiceContext(req));
  const { page, limit, status, search } = req.query;
  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ProjectService(getServiceContext(req));
  const project = await service.update(req.params.id, req.body);
  res.json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ProjectService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Project deleted' });
});