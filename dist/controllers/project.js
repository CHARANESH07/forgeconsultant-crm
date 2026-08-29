"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.listProjects = exports.getProject = exports.createProject = void 0;
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
exports.createProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ProjectService(getServiceContext(req));
    const project = await service.create(req.body);
    res.status(201).json({ success: true, data: project });
});
exports.getProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ProjectService(getServiceContext(req));
    const project = await service.findById(req.params.id);
    if (!project)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json({ success: true, data: project });
});
exports.listProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ProjectService(getServiceContext(req));
    const { page, limit, status, search } = req.query;
    const where = {};
    if (status && status !== 'all')
        where.status = status;
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
exports.updateProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ProjectService(getServiceContext(req));
    const project = await service.update(req.params.id, req.body);
    res.json({ success: true, data: project });
});
exports.deleteProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ProjectService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
});
//# sourceMappingURL=project.js.map