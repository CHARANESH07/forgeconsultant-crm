import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class DocumentRepository extends AbstractRepository<any, Prisma.DocumentCreateInput, Prisma.DocumentUpdateInput, Prisma.DocumentWhereInput> {
    protected modelName: string;
    findByEntity(entityType: string, entityId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByUploader(uploaderId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getDocumentWithRelations(id: string): Promise<any>;
}
export declare const documentRepository: DocumentRepository;
//# sourceMappingURL=document.d.ts.map