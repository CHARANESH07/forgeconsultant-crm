"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPipelineStats = exports.moveDealStage = exports.deleteDeal = exports.updateDeal = exports.listDeals = exports.getDeal = exports.createDeal = void 0;
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
exports.createDeal = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    const deal = await service.create((0, mappers_1.mapKeys)(req.body, mappers_1.dealFieldMap));
    res.status(201).json({ success: true, data: deal });
});
exports.getDeal = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    const deal = await service.findById(req.params.id);
    if (!deal)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Deal not found' } });
    res.json({ success: true, data: deal });
});
exports.listDeals = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    const { page, limit, stage, serviceType, search } = req.query;
    const where = {};
    if (stage && stage !== 'all')
        where.stage = stage;
    if (serviceType)
        where.service_type = serviceType;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { contact_name: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.updateDeal = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    const deal = await service.update(req.params.id, (0, mappers_1.mapKeys)(req.body, mappers_1.dealFieldMap));
    res.json({ success: true, data: deal });
});
exports.deleteDeal = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Deal deleted' });
});
exports.moveDealStage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    const deal = await service.moveStage(req.params.id, req.body.stage);
    res.json({ success: true, data: deal });
});
exports.getPipelineStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DealService(getServiceContext(req));
    const stats = await service.getPipelineStats();
    res.json({ success: true, data: stats });
});
//# sourceMappingURL=deal.js.map