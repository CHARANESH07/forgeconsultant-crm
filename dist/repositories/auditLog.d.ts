import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class AuditLogRepository extends AbstractRepository<any, Prisma.AuditLogCreateInput, Prisma.AuditLogUpdateInput, Prisma.AuditLogWhereInput> {
    protected modelName: string;
    findByEntity(entityType: string, entityId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByUser(userName: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByOrganization(orgId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    log(input: {
        organizationId: string;
        action: string;
        entityType: string;
        entityId: string;
        entityTitle?: string;
        userName: string;
        details?: string;
        requestMeta?: Record<string, unknown>;
    }): Promise<any>;
}
export declare const auditLogRepository: AuditLogRepository;
//# sourceMappingURL=auditLog.d.ts.map