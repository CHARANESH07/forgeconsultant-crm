"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRepository = exports.NotificationRepository = void 0;
const base_1 = require("./base");
class NotificationRepository extends base_1.AbstractRepository {
    modelName = 'notification';
    async findByUser(userId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { user_id: userId }, pagination, orderBy: { created_at: 'desc' } });
    }
    async findUnreadByUser(userId) {
        return this.model.findMany({
            where: { user_id: userId, read: false },
            orderBy: { created_at: 'desc' },
        });
    }
    async markAsRead(id) {
        return this.model.update({ where: { id }, data: { read: true } });
    }
    async markAllAsRead(userId) {
        return this.model.updateMany({ where: { user_id: userId, read: false }, data: { read: true } });
    }
    async getUnreadCount(userId) {
        return this.model.count({ where: { user_id: userId, read: false } });
    }
}
exports.NotificationRepository = NotificationRepository;
exports.notificationRepository = new NotificationRepository();
//# sourceMappingURL=notification.js.map