import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class NotificationRepository extends AbstractRepository<any, Prisma.NotificationCreateInput, Prisma.NotificationUpdateInput, Prisma.NotificationWhereInput> {
    protected modelName: string;
    findByUser(userId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findUnreadByUser(userId: string): Promise<any>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    getUnreadCount(userId: string): Promise<any>;
}
export declare const notificationRepository: NotificationRepository;
//# sourceMappingURL=notification.d.ts.map