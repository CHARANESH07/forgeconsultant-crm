"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEmployees = exports.deleteEmployee = exports.updateEmployee = exports.listEmployees = exports.getEmployee = exports.createEmployee = void 0;
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
exports.createEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.EmployeeService(getServiceContext(req));
    const employee = await service.create(req.body);
    res.status(201).json({ success: true, data: employee });
});
exports.getEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.EmployeeService(getServiceContext(req));
    const employee = await service.findById(req.params.id);
    if (!employee)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } });
    res.json({ success: true, data: employee });
});
exports.listEmployees = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.EmployeeService(getServiceContext(req));
    const { page, limit, department, search } = req.query;
    const where = {};
    if (department && department !== 'all')
        where.department = department;
    if (search) {
        where.OR = [
            { full_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { employee_id: { contains: search, mode: 'insensitive' } },
            { designation: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.updateEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.EmployeeService(getServiceContext(req));
    const employee = await service.update(req.params.id, req.body);
    res.json({ success: true, data: employee });
});
exports.deleteEmployee = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.EmployeeService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Employee deleted' });
});
exports.searchEmployees = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.EmployeeService(getServiceContext(req));
    const { q, page, limit } = req.query;
    if (!q)
        return res.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } });
    const result = await service.search(q, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
    res.json({ success: true, ...result });
});
//# sourceMappingURL=employee.js.map