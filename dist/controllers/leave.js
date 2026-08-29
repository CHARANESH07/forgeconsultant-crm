"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLeave = exports.approveLeave = exports.listLeaves = exports.getLeave = exports.createLeave = void 0;
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
exports.createLeave = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeaveService(getServiceContext(req));
    const leave = await service.create(req.body);
    res.status(201).json({ success: true, data: leave });
});
exports.getLeave = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeaveService(getServiceContext(req));
    const leave = await service.findById(req.params.id);
    if (!leave)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Leave request not found' } });
    res.json({ success: true, data: leave });
});
exports.listLeaves = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeaveService(getServiceContext(req));
    const { page, limit, employeeId, status, leaveType } = req.query;
    const where = {};
    if (employeeId)
        where.employee_id = employeeId;
    if (status && status !== 'all')
        where.status = status;
    if (leaveType && leaveType !== 'all')
        where.leave_type = leaveType;
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.approveLeave = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeaveService(getServiceContext(req));
    const leave = await service.approve(req.params.id, req.body.comments);
    res.json({ success: true, data: leave });
});
exports.rejectLeave = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeaveService(getServiceContext(req));
    const leave = await service.reject(req.params.id, req.body.comments);
    res.json({ success: true, data: leave });
});
//# sourceMappingURL=leave.js.map