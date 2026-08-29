"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyStats = exports.deleteCompany = exports.updateCompany = exports.listCompanies = exports.getCompany = exports.createCompany = void 0;
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
exports.createCompany = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.CompanyService(getServiceContext(req));
    const company = await service.create((0, mappers_1.mapKeys)(req.body, mappers_1.companyFieldMap));
    res.status(201).json({ success: true, data: company });
});
exports.getCompany = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.CompanyService(getServiceContext(req));
    const company = await service.findById(req.params.id);
    if (!company)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Company not found' } });
    res.json({ success: true, data: company });
});
exports.listCompanies = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.CompanyService(getServiceContext(req));
    const { page, limit, tier, search } = req.query;
    const where = {};
    if (tier && tier !== 'all')
        where.tier = tier;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { industry: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.updateCompany = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.CompanyService(getServiceContext(req));
    const company = await service.update(req.params.id, (0, mappers_1.mapKeys)(req.body, mappers_1.companyFieldMap));
    res.json({ success: true, data: company });
});
exports.deleteCompany = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.CompanyService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Company deleted' });
});
exports.getCompanyStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.CompanyService(getServiceContext(req));
    const stats = await service.getStats();
    res.json({ success: true, data: stats });
});
//# sourceMappingURL=company.js.map