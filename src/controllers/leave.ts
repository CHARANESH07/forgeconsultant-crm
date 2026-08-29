import { Response } from 'express';
import { LeaveService, ServiceContext } from '@/services';
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

export const createLeave = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeaveService(getServiceContext(req));
  const leave = await service.create(req.body);
  res.status(201).json({ success: true, data: leave });
});

export const getLeave = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeaveService(getServiceContext(req));
  const leave = await service.findById(req.params.id);
  if (!leave) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Leave request not found' } });
  res.json({ success: true, data: leave });
});

export const listLeaves = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeaveService(getServiceContext(req));
  const { page, limit, employeeId, status, leaveType } = req.query;
  const where: any = {};
  if (employeeId) where.employee_id = employeeId;
  if (status && status !== 'all') where.status = status;
  if (leaveType && leaveType !== 'all') where.leave_type = leaveType;
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const approveLeave = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeaveService(getServiceContext(req));
  const leave = await service.approve(req.params.id, req.body.comments);
  res.json({ success: true, data: leave });
});

export const rejectLeave = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new LeaveService(getServiceContext(req));
  const leave = await service.reject(req.params.id, req.body.comments);
  res.json({ success: true, data: leave });
});