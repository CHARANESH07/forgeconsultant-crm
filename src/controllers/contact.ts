import { Response } from 'express';
import { ContactService, ServiceContext } from '@/services';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';
import { contactFieldMap, mapKeys } from '@/utils/mappers';

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

export const createContact = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ContactService(getServiceContext(req));
  const contact = await service.create(mapKeys(req.body, contactFieldMap));
  res.status(201).json({ success: true, data: contact });
});

export const getContact = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ContactService(getServiceContext(req));
  const contact = await service.findById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Contact not found' } });
  res.json({ success: true, data: contact });
});

export const listContacts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ContactService(getServiceContext(req));
  const { page, limit, search } = req.query;
  const where: any = {};
  if (search) {
    where.OR = [
      { first_name: { contains: search as string, mode: 'insensitive' } },
      { last_name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateContact = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ContactService(getServiceContext(req));
  const contact = await service.update(req.params.id, mapKeys(req.body, contactFieldMap));
  res.json({ success: true, data: contact });
});

export const deleteContact = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new ContactService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});