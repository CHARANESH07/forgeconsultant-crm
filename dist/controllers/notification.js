"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.listNotifications = void 0;
const services_1 = require("../services");
const errorHandler_1 = require("../middleware/errorHandler");
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
exports.listNotifications = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.NotificationService(getServiceContext(req));
    const { page, limit } = req.query;
    const result = await service.findByUser({ page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.json({ success: true, ...result });
});
exports.getUnreadCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.NotificationService(getServiceContext(req));
    const count = await service.getUnreadCount();
    res.json({ success: true, data: { count } });
});
exports.markAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.NotificationService(getServiceContext(req));
    await service.markAsRead(req.params.id);
    res.json({ success: true, message: 'Notification marked as read' });
});
exports.markAllAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.NotificationService(getServiceContext(req));
    await service.markAllAsRead();
    res.json({ success: true, message: 'All notifications marked as read' });
});
//# sourceMappingURL=notification.js.map