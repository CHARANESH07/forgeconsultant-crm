import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class LeadRepository extends AbstractRepository<any, Prisma.LeadCreateInput, Prisma.LeadUpdateInput, Prisma.LeadWhereInput> {
    protected modelName: string;
    findByEmail(email: string): Promise<any>;
    findByStatus(status: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByOwner(ownerId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByCompany(companyName: string): Promise<any>;
    getLeadWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getStats(): Promise<{
        total: any;
        byStatus: any;
        avgScore: any;
        totalValue: any;
    }>;
}
export declare const leadRepository: LeadRepository;
//# sourceMappingURL=lead.d.ts.map