import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class LeaveRepository extends AbstractRepository<any, Prisma.LeaveRequestCreateInput, Prisma.LeaveRequestUpdateInput, Prisma.LeaveRequestWhereInput> {
    protected modelName: string;
    findByEmployee(employeeId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findPendingForApprover(approverId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findPendingAll(pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getLeaveWithRelations(id: string): Promise<any>;
}
export declare const leaveRepository: LeaveRepository;
//# sourceMappingURL=leave.d.ts.map