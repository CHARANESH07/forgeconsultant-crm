import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class ProjectRepository extends AbstractRepository<any, Prisma.ProjectCreateInput, Prisma.ProjectUpdateInput, Prisma.ProjectWhereInput> {
    protected modelName: string;
    findByManager(managerId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByClient(clientId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByStatus(status: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getProjectWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
}
export declare const projectRepository: ProjectRepository;
//# sourceMappingURL=project.d.ts.map