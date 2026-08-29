import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class EmployeeRepository extends AbstractRepository<any, Prisma.EmployeeCreateInput, Prisma.EmployeeUpdateInput, Prisma.EmployeeWhereInput> {
    protected modelName: string;
    findByEmail(email: string): Promise<any>;
    findByEmployeeId(employeeId: string): Promise<any>;
    findByDepartment(department: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByTeam(teamId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findSuperiors(): Promise<any>;
    findSubordinates(superiorId: string): Promise<any>;
    findByCrmRole(crmRole: string): Promise<any>;
    getEmployeeWithRelations(id: string): Promise<any>;
    search(query: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
}
export declare const employeeRepository: EmployeeRepository;
//# sourceMappingURL=employee.d.ts.map