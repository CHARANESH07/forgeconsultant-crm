"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRepository = exports.ActivityRepository = void 0;
const base_1 = require("./base");
class ActivityRepository extends base_1.AbstractRepository {
    modelName = 'activity';
    async findByEntity(entityType, entityId, pagination = { page: 1, limit: 50 }) {
        return this.findMany({
            where: { entity_type: entityType, entity_id: entityId },
            pagination,
            orderBy: { created_at: 'desc' },
        });
    }
    async findByUser(userId, pagination = { page: 1, limit: 50 }) {
        return this.findMany({ where: { user_id: userId }, pagination, orderBy: { created_at: 'desc' } });
    }
    async getRecentActivity(limit = 20) {
        return this.model.findMany({
            take: limit,
            orderBy: { created_at: 'desc' },
        });
    }
}
exports.ActivityRepository = ActivityRepository;
exports.activityRepository = new ActivityRepository();
//# sourceMappingURL=activity.js.map