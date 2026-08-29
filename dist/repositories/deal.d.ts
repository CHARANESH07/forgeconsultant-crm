import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class DealRepository extends AbstractRepository<any, Prisma.DealCreateInput, Prisma.DealUpdateInput, Prisma.DealWhereInput> {
    protected modelName: string;
    findByStage(stage: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByOwner(ownerId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByCompany(companyId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getDealWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getPipelineStats(): Promise<{
        byStage: any;
        totalValue: any;
        wonValue: any;
        lostValue: any;
    }>;
    moveStage(dealId: string, newStage: string): Promise<any>;
}
export declare const dealRepository: DealRepository;
//# sourceMappingURL=deal.d.ts.map