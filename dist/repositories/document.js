"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRepository = exports.DocumentRepository = void 0;
const base_1 = require("./base");
class DocumentRepository extends base_1.AbstractRepository {
    modelName = 'document';
    async findByEntity(entityType, entityId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { related_entity_type: entityType, related_entity_id: entityId }, pagination });
    }
    async findByUploader(uploaderId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { uploaded_by_id: uploaderId }, pagination });
    }
    async getDocumentWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: { uploaded_by: true },
        });
    }
}
exports.DocumentRepository = DocumentRepository;
exports.documentRepository = new DocumentRepository();
//# sourceMappingURL=document.js.map