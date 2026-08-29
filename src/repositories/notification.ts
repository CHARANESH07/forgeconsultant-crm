import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class NotificationRepository extends AbstractRepository<
  any,
  Prisma.NotificationCreateInput,
  Prisma.NotificationUpdateInput,
  Prisma.NotificationWhereInput
> {
  protected modelName = 'notification';

  async findByUser(userId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { user_id: userId }, pagination, orderBy: { created_at: 'desc' } });
  }

  async findUnreadByUser(userId: string) {
    return this.model.findMany({
      where: { user_id: userId, read: false },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.model.update({ where: { id }, data: { read: true } });
  }

  async markAllAsRead(userId: string) {
    return this.model.updateMany({ where: { user_id: userId, read: false }, data: { read: true } });
  }

  async getUnreadCount(userId: string) {
    return this.model.count({ where: { user_id: userId, read: false } });
  }
}

export const notificationRepository = new NotificationRepository();