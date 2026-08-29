import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class CompanyRepository extends AbstractRepository<any, Prisma.CompanyCreateInput, Prisma.CompanyUpdateInput, Prisma.CompanyWhereInput> {
    protected modelName: string;
    findByName(name: string): Promise<any>;
    findByOwner(ownerId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByTier(tier: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getCompanyWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getStats(): Promise<{
        total: any;
        byTier: any;
        totalRevenue: any;
    }>;
}
export declare const companyRepository: CompanyRepository;
//# sourceMappingURL=company.d.ts.map