"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadStats = exports.convertLead = exports.deleteLead = exports.updateLead = exports.listLeads = exports.getLead = exports.createLead = void 0;
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
exports.createLead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    const lead = await service.create((0, mappers_1.mapKeys)(req.body, mappers_1.leadFieldMap));
    res.status(201).json({ success: true, data: lead });
});
exports.getLead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    const lead = await service.findById(req.params.id);
    if (!lead)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } });
    res.json({ success: true, data: lead });
});
exports.listLeads = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    const { page, limit, sortBy, sortOrder, status, search } = req.query;
    const where = {};
    if (status && status !== 'all')
        where.status = status;
    if (search) {
        where.OR = [
            { first_name: { contains: search, mode: 'insensitive' } },
            { last_name: { contains: search, mode: 'insensitive' } },
            { company_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20, sortBy: sortBy, sortOrder: sortOrder },
    });
    res.json({ success: true, ...result });
});
exports.updateLead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    const lead = await service.update(req.params.id, (0, mappers_1.mapKeys)(req.body, mappers_1.leadFieldMap));
    res.json({ success: true, data: lead });
});
exports.deleteLead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Lead deleted' });
});
exports.convertLead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    const result = await service.convert(req.params.id, req.body);
    res.json({ success: true, data: result });
});
exports.getLeadStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.LeadService(getServiceContext(req));
    const stats = await service.getStats();
    res.json({ success: true, data: stats });
});
//# sourceMappingURL=lead.js.map