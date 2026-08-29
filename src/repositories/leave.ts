import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class LeaveRepository extends AbstractRepository<
  any,
  Prisma.LeaveRequestCreateInput,
  Prisma.LeaveRequestUpdateInput,
  Prisma.LeaveRequestWhereInput
> {
  protected modelName = 'leaveRequest';

  async findByEmployee(employeeId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { employee_id: employeeId }, pagination, orderBy: { created_at: 'desc' } });
  }

  async findPendingForApprover(approverId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({
      where: { status: 'Pending', approved_by_id: approverId },
      pagination,
      orderBy: { created_at: 'desc' },
    });
  }

  async findPendingAll(pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { status: 'Pending' }, pagination, orderBy: { created_at: 'desc' } });
  }

  async getLeaveWithRelations(id: string) {
    return this.model.findUnique({
      where: { id },
      include: { employee: true, approved_by: true },
    });
  }
}

export const leaveRepository = new LeaveRepository();