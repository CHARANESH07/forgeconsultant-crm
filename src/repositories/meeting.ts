import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class MeetingRepository extends AbstractRepository<
  any,
  Prisma.MeetingCreateInput,
  Prisma.MeetingUpdateInput,
  Prisma.MeetingWhereInput
> {
  protected modelName = 'meeting';

  async findByHost(hostId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { host_id: hostId }, pagination, orderBy: { start_time: 'desc' } });
  }

  async findByStatus(status: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { status }, pagination, orderBy: { start_time: 'desc' } });
  }
}

export const meetingRepository = new MeetingRepository();
