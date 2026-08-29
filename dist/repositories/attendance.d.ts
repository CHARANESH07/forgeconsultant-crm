import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class AttendanceRepository extends AbstractRepository<any, Prisma.AttendanceCreateInput, Prisma.AttendanceUpdateInput, Prisma.AttendanceWhereInput> {
    protected modelName: string;
    findByEmployeeAndDate(employeeId: string, date: string): Promise<any>;
    findByEmployee(employeeId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByDate(date: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    getTodayAttendance(): Promise<any>;
}
export declare const attendanceRepository: AttendanceRepository;
//# sourceMappingURL=attendance.d.ts.map