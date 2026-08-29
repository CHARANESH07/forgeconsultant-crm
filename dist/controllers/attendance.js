"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayAttendance = exports.listAttendance = exports.checkOut = exports.checkIn = void 0;
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
exports.checkIn = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.AttendanceService(getServiceContext(req));
    const attendance = await service.checkIn(req.body);
    res.status(201).json({ success: true, data: attendance });
});
exports.checkOut = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.AttendanceService(getServiceContext(req));
    const attendance = await service.checkOut(req.body);
    res.json({ success: true, data: attendance });
});
exports.listAttendance = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.AttendanceService(getServiceContext(req));
    const { page, limit, employeeId, startDate, endDate, status } = req.query;
    const where = {};
    if (employeeId)
        where.employee_id = employeeId;
    if (startDate && endDate)
        where.date = { gte: startDate, lte: endDate };
    if (status && status !== 'all')
        where.status = status;
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 30 },
    });
    res.json({ success: true, ...result });
});
exports.getTodayAttendance = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.AttendanceService(getServiceContext(req));
    const attendance = await service.getToday();
    res.json({ success: true, data: attendance });
});
//# sourceMappingURL=attendance.js.map