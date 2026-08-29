"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = exports.AuditLogRepository = void 0;
const base_1 = require("./base");
class AuditLogRepository extends base_1.AbstractRepository {
    modelName = 'auditLog';
    async findByEntity(entityType, entityId, pagination = { page: 1, limit: 50 }) {
        return this.findMany({ where: { entity_type: entityType, entity_id: entityId }, pagination, orderBy: { created_at: 'desc' } });
    }
    async findByUser(userName, pagination = { page: 1, limit: 50 }) {
        return this.findMany({ where: { user_name: userName }, pagination, orderBy: { created_at: 'desc' } });
    }
    async findByOrganization(orgId, pagination = { page: 1, limit: 50 }) {
        return this.findMany({ where: { organization_id: orgId }, pagination, orderBy: { created_at: 'desc' } });
    }
    async log(input) {
        return this.model.create({
            data: {
                organization_id: input.organizationId,
                action: input.action,
                entity_type: input.entityType,
                entity_id: input.entityId,
                entity_title: input.entityTitle,
                user_name: input.userName,
                details: input.details,
                request_meta: input.requestMeta,
            },
        });
    }
}
exports.AuditLogRepository = AuditLogRepository;
exports.auditLogRepository = new AuditLogRepository();
//# sourceMappingURL=auditLog.js.map