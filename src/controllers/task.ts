import { Response } from 'express';
import { TaskService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { taskFieldMap, mapKeys } from '@/utils/mappers';

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

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new TaskService(getServiceContext(req));
  const task = await service.create(mapKeys(req.body, taskFieldMap));
  res.status(201).json({ success: true, data: task });
});

export const getTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new TaskService(getServiceContext(req));
  const task = await service.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
  res.json({ success: true, data: task });
});

export const listTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new TaskService(getServiceContext(req));
  const { page, limit, status, priority, search } = req.query;
  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (priority && priority !== 'all') where.priority = priority;
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

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new TaskService(getServiceContext(req));
  const task = await service.update(req.params.id, mapKeys(req.body, taskFieldMap));
  res.json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new TaskService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Task deleted' });
});

export const toggleTaskCompletion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new TaskService(getServiceContext(req));
  const task = await service.toggleCompletion(req.params.id);
  res.json({ success: true, data: task });
});