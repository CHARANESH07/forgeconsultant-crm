import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class ActivityRepository extends AbstractRepository<any, Prisma.ActivityCreateInput, Prisma.ActivityUpdateInput, Prisma.ActivityWhereInput> {
    protected modelName: string;
    findByEntity(entityType: string, entityId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByUser(userId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getRecentActivity(limit?: number): Promise<any>;
}
export declare const activityRepository: ActivityRepository;
//# sourceMappingURL=activity.d.ts.map