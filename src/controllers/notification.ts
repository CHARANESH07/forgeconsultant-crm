import { Response } from 'express';
import { NotificationService, ServiceContext } from '@/services';
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

export const listNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new NotificationService(getServiceContext(req));
  const { page, limit } = req.query;
  const result = await service.findByUser({ page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 });
  res.json({ success: true, ...result });
});

export const getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new NotificationService(getServiceContext(req));
  const count = await service.getUnreadCount();
  res.json({ success: true, data: { count } });
});

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new NotificationService(getServiceContext(req));
  await service.markAsRead(req.params.id);
  res.json({ success: true, message: 'Notification marked as read' });
});

export const markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new NotificationService(getServiceContext(req));
  await service.markAllAsRead();
  res.json({ success: true, message: 'All notifications marked as read' });
});