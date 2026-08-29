import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class AttendanceRepository extends AbstractRepository<
  any,
  Prisma.AttendanceCreateInput,
  Prisma.AttendanceUpdateInput,
  Prisma.AttendanceWhereInput
> {
  protected modelName = 'attendance';

  async findByEmployeeAndDate(employeeId: string, date: string) {
    return this.model.findUnique({ where: { employee_id_date: { employee_id: employeeId, date } } });
  }

  async findByEmployee(employeeId: string, pagination: PaginationParams = { page: 1, limit: 30 }) {
    return this.findMany({
      where: { employee_id: employeeId },
      pagination,
      orderBy: { date: 'desc' },
    });
  }

  async findByDate(date: string, pagination: PaginationParams = { page: 1, limit: 100 }) {
    return this.findMany({
      where: { date },
      pagination,
      include: { employee: { select: { full_name: true, employee_id: true, email: true } } },
    });
  }

  async getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    return this.model.findMany({
      where: { date: today },
      include: { employee: { select: { full_name: true, employee_id: true, email: true, department: true } } },
    });
  }
}

export const attendanceRepository = new AttendanceRepository();