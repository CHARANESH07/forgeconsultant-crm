"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getEntityActivities = exports.listActivities = exports.createActivity = void 0;
const services_1 = require("../services");
const errorHandler_1 = require("../middleware/errorHandler");
const mappers_1 = require("../utils/mappers");
function getServiceContext(req) {
    const user = req.user;
    return {
        userId: user.userId,
        userRole: user.role,
        userEmail: user.email,
        userName: user.full_name || user.email,
        organizationId: user.organizationId,
        employeeId: user.employeeId,
        crmRole: user.crmRole,
        isSuperior: user.isSuperior,
    };
}
exports.createActivity = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ActivityService(getServiceContext(req));
    const activity = await service.create((0, mappers_1.mapKeys)(req.body, mappers_1.activityFieldMap));
    res.status(201).json({ success: true, data: activity });
});
exports.listActivities = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ActivityService(getServiceContext(req));
    const { page, limit, type, entityType, search } = req.query;
    const where = {};
    if (type)
        where.type = type;
    if (entityType)
        where.entity_type = entityType;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 50 },
    });
    res.json({ success: true, ...result });
});
exports.getEntityActivities = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ActivityService(getServiceContext(req));
    const { entityType, entityId, page, limit } = req.query;
    if (!entityType || !entityId)
        return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'entityType and entityId required' } });
    const result = await service.findByEntity(entityType, entityId, { page: parseInt(page) || 1, limit: parseInt(limit) || 50 });
    res.json({ success: true, ...result });
});
exports.getRecentActivity = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ActivityService(getServiceContext(req));
    const { limit } = req.query;
    const activities = await service.getRecent(parseInt(limit) || 20);
    res.json({ success: true, data: activities });
});
//# sourceMappingURL=activity.js.map