"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRepository = exports.LeadRepository = void 0;
const base_1 = require("./base");
class LeadRepository extends base_1.AbstractRepository {
    modelName = 'lead';
    async findByEmail(email) {
        return this.model.findUnique({ where: { email } });
    }
    async findByStatus(status, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { status }, pagination });
    }
    async findByOwner(ownerId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { owner_id: ownerId }, pagination });
    }
    async findByCompany(companyName) {
        return this.model.findMany({ where: { company_name: { equals: companyName, mode: 'insensitive' } } });
    }
    async getLeadWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                owner: true,
            },
        });
    }
    async search(query, pagination = { page: 1, limit: 20 }) {
        return this.findMany({
            where: {
                OR: [
                    { first_name: { contains: query, mode: 'insensitive' } },
                    { last_name: { contains: query, mode: 'insensitive' } },
                    { company_name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { industry: { contains: query, mode: 'insensitive' } },
                ],
            },
            pagination,
        });
    }
    async getStats() {
        const [total, byStatus, avgScore, totalValue] = await Promise.all([
            this.model.count(),
            this.model.groupBy({ by: ['status'], _count: true }),
            this.model.aggregate({ _avg: { lead_score: true } }),
            this.model.aggregate({ _sum: { estimated_value: true } }),
        ]);
        return {
            total,
            byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {}),
            avgScore: avgScore._avg.lead_score || 0,
            totalValue: totalValue._sum.estimated_value || 0,
        };
    }
}
exports.LeadRepository = LeadRepository;
exports.leadRepository = new LeadRepository();
//# sourceMappingURL=lead.js.map