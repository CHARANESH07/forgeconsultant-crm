import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class AuditLogRepository extends AbstractRepository<
  any,
  Prisma.AuditLogCreateInput,
  Prisma.AuditLogUpdateInput,
  Prisma.AuditLogWhereInput
> {
  protected modelName = 'auditLog';

  async findByEntity(entityType: string, entityId: string, pagination: PaginationParams = { page: 1, limit: 50 }) {
    return this.findMany({ where: { entity_type: entityType, entity_id: entityId }, pagination, orderBy: { created_at: 'desc' } });
  }

  async findByUser(userName: string, pagination: PaginationParams = { page: 1, limit: 50 }) {
    return this.findMany({ where: { user_name: userName }, pagination, orderBy: { created_at: 'desc' } });
  }

  async findByOrganization(orgId: string, pagination: PaginationParams = { page: 1, limit: 50 }) {
    return this.findMany({ where: { organization_id: orgId }, pagination, orderBy: { created_at: 'desc' } });
  }

  async log(input: {
    organizationId: string;
    action: string;
    entityType: string;
    entityId: string;
    entityTitle?: string;
    userName: string;
    details?: string;
    requestMeta?: Record<string, unknown>;
  }) {
    return this.model.create({
      data: {
        organization_id: input.organizationId,
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        entity_title: input.entityTitle,
        user_name: input.userName,
        details: input.details,
        request_meta: input.requestMeta as Prisma.InputJsonValue,
      },
    });
  }
}

export const auditLogRepository = new AuditLogRepository();