import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class TaskRepository extends AbstractRepository<any, Prisma.TaskCreateInput, Prisma.TaskUpdateInput, Prisma.TaskWhereInput> {
    protected modelName: string;
    findByAssignee(assigneeId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByProject(projectId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByStatus(status: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getTaskWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    toggleCompletion(id: string): Promise<any>;
}
export declare const taskRepository: TaskRepository;
//# sourceMappingURL=task.d.ts.map