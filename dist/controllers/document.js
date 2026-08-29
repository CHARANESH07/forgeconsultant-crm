"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.listDocuments = exports.getDocument = exports.createDocument = void 0;
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
exports.createDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DocumentService(getServiceContext(req));
    const document = await service.create(req.body);
    res.status(201).json({ success: true, data: document });
});
exports.getDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DocumentService(getServiceContext(req));
    const document = await service.findById(req.params.id);
    if (!document)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } });
    res.json({ success: true, data: document });
});
exports.listDocuments = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DocumentService(getServiceContext(req));
    const { page, limit, category, relatedEntityType, relatedEntityId } = req.query;
    const where = {};
    if (category)
        where.category = category;
    if (relatedEntityType)
        where.related_entity_type = relatedEntityType;
    if (relatedEntityId)
        where.related_entity_id = relatedEntityId;
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.updateDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DocumentService(getServiceContext(req));
    const document = await service.update(req.params.id, req.body);
    res.json({ success: true, data: document });
});
exports.deleteDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.DocumentService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Document deleted' });
});
//# sourceMappingURL=document.js.map