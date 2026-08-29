"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTaskCompletion = exports.deleteTask = exports.updateTask = exports.listTasks = exports.getTask = exports.createTask = void 0;
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
exports.createTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.TaskService(getServiceContext(req));
    const task = await service.create((0, mappers_1.mapKeys)(req.body, mappers_1.taskFieldMap));
    res.status(201).json({ success: true, data: task });
});
exports.getTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.TaskService(getServiceContext(req));
    const task = await service.findById(req.params.id);
    if (!task)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } });
    res.json({ success: true, data: task });
});
exports.listTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.TaskService(getServiceContext(req));
    const { page, limit, status, priority, search } = req.query;
    const where = {};
    if (status && status !== 'all')
        where.status = status;
    if (priority && priority !== 'all')
        where.priority = priority;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.updateTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.TaskService(getServiceContext(req));
    const task = await service.update(req.params.id, (0, mappers_1.mapKeys)(req.body, mappers_1.taskFieldMap));
    res.json({ success: true, data: task });
});
exports.deleteTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.TaskService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Task deleted' });
});
exports.toggleTaskCompletion = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.TaskService(getServiceContext(req));
    const task = await service.toggleCompletion(req.params.id);
    res.json({ success: true, data: task });
});
//# sourceMappingURL=task.js.map