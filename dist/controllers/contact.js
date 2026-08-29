"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.listContacts = exports.getContact = exports.createContact = void 0;
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
exports.createContact = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ContactService(getServiceContext(req));
    const contact = await service.create((0, mappers_1.mapKeys)(req.body, mappers_1.contactFieldMap));
    res.status(201).json({ success: true, data: contact });
});
exports.getContact = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ContactService(getServiceContext(req));
    const contact = await service.findById(req.params.id);
    if (!contact)
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Contact not found' } });
    res.json({ success: true, data: contact });
});
exports.listContacts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ContactService(getServiceContext(req));
    const { page, limit, search } = req.query;
    const where = {};
    if (search) {
        where.OR = [
            { first_name: { contains: search, mode: 'insensitive' } },
            { last_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }
    const result = await service.findMany({
        where,
        pagination: { page: parseInt(page) || 1, limit: parseInt(limit) || 20 },
    });
    res.json({ success: true, ...result });
});
exports.updateContact = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ContactService(getServiceContext(req));
    const contact = await service.update(req.params.id, (0, mappers_1.mapKeys)(req.body, mappers_1.contactFieldMap));
    res.json({ success: true, data: contact });
});
exports.deleteContact = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = new services_1.ContactService(getServiceContext(req));
    await service.delete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
});
//# sourceMappingURL=contact.js.map