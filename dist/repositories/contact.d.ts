import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class ContactRepository extends AbstractRepository<any, Prisma.ContactCreateInput, Prisma.ContactUpdateInput, Prisma.ContactWhereInput> {
    protected modelName: string;
    findByEmail(email: string): Promise<any>;
    findByCompany(companyId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByOwner(ownerId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getContactWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
}
export declare const contactRepository: ContactRepository;
//# sourceMappingURL=contact.d.ts.map