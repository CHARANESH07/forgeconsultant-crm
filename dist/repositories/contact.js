"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRepository = exports.ContactRepository = void 0;
const base_1 = require("./base");
class ContactRepository extends base_1.AbstractRepository {
    modelName = 'contact';
    async findByEmail(email) {
        return this.model.findUnique({ where: { email } });
    }
    async findByCompany(companyId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { company_id: companyId }, pagination });
    }
    async findByOwner(ownerId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { owner_id: ownerId }, pagination });
    }
    async getContactWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                company: true,
                owner: true,
                deals: true,
            },
        });
    }
    async search(query, pagination = { page: 1, limit: 20 }) {
        return this.findMany({
            where: {
                OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { job_title: { contains: query, mode: 'insensitive' } },
                    { company: { name: { contains: query, mode: 'insensitive' } } },
                ],
            },
            pagination,
        });
    }
}
exports.ContactRepository = ContactRepository;
exports.contactRepository = new ContactRepository();
//# sourceMappingURL=contact.js.map