import { Response } from 'express';
import { DocumentService, ServiceContext } from '@/services';
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

export const createDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DocumentService(getServiceContext(req));
  const document = await service.create(req.body);
  res.status(201).json({ success: true, data: document });
});

export const getDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DocumentService(getServiceContext(req));
  const document = await service.findById(req.params.id);
  if (!document) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } });
  res.json({ success: true, data: document });
});

export const listDocuments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DocumentService(getServiceContext(req));
  const { page, limit, category, relatedEntityType, relatedEntityId } = req.query;
  const where: any = {};
  if (category) where.category = category;
  if (relatedEntityType) where.related_entity_type = relatedEntityType;
  if (relatedEntityId) where.related_entity_id = relatedEntityId;
  const result = await service.findMany({
    where,
    pagination: { page: parseInt(page as string) || 1, limit: parseInt(limit as string) || 20 },
  });
  res.json({ success: true, ...result });
});

export const updateDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DocumentService(getServiceContext(req));
  const document = await service.update(req.params.id, req.body);
  res.json({ success: true, data: document });
});

export const deleteDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const service = new DocumentService(getServiceContext(req));
  await service.delete(req.params.id);
  res.json({ success: true, message: 'Document deleted' });
});