import { Response } from 'express';
import { MeetingService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { meetingFieldMap, mapKeys } from '@/utils/mappers';

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

export const createMeeting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new MeetingService(getServiceContext(req));
  const meeting = await service.create(mapKeys(req.body, meetingFieldMap));
  res.status(201).json({ success: true, data: meeting });
});

export const getMeeting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new MeetingService(getServiceContext(req));
  const meeting = await service.findById(req.params.id);
  if (!meeting) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Meeting not found' } });
  res.json({ success: true, data: meeting });
});

export const listMeetings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new MeetingService(getServiceContext(req));
  const { page, limit, status, search } = req.query;
  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { company_name: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateMeeting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new MeetingService(getServiceContext(req));
  const meeting = await service.update(req.params.id, mapKeys(req.body, meetingFieldMap));
  res.json({ success: true, data: meeting });
});

export const deleteMeeting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new MeetingService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Meeting deleted' });
});
