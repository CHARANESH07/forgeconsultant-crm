import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class ActivityRepository extends AbstractRepository<
  any,
  Prisma.ActivityCreateInput,
  Prisma.ActivityUpdateInput,
  Prisma.ActivityWhereInput
> {
  protected modelName = 'activity';

  async findByEntity(entityType: string, entityId: string, pagination: PaginationParams = { page: 1, limit: 50 }) {
    return this.findMany({
      where: { entity_type: entityType, entity_id: entityId },
      pagination,
      orderBy: { created_at: 'desc' },
    });
  }

  async findByUser(userId: string, pagination: PaginationParams = { page: 1, limit: 50 }) {
    return this.findMany({ where: { user_id: userId }, pagination, orderBy: { created_at: 'desc' } });
  }

  async getRecentActivity(limit = 20) {
    return this.model.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
    });
  }
}

export const activityRepository = new ActivityRepository();