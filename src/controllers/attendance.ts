import { Response } from 'express';
import { AttendanceService, ServiceContext } from '@/services';
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

export const checkIn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new AttendanceService(getServiceContext(req));
  const attendance = await service.checkIn(req.body);
  res.status(201).json({ success: true, data: attendance });
});

export const checkOut = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new AttendanceService(getServiceContext(req));
  const attendance = await service.checkOut(req.body);
  res.json({ success: true, data: attendance });
});

export const listAttendance = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new AttendanceService(getServiceContext(req));
  const { page, limit, employeeId, startDate, endDate, status } = req.query;
  const where: any = {};
  if (employeeId) where.employee_id = employeeId;
  if (startDate && endDate) where.date = { gte: startDate, lte: endDate };
  if (status && status !== 'all') where.status = status;
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 30 },
  });
  res.json({ success: true, ...result });
});

export const getTodayAttendance = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new AttendanceService(getServiceContext(req));
  const attendance = await service.getToday();
  res.json({ success: true, data: attendance });
});