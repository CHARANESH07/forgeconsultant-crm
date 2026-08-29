"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRepository = exports.CompanyRepository = void 0;
const base_1 = require("./base");
class CompanyRepository extends base_1.AbstractRepository {
    modelName = 'company';
    async findByName(name) {
        return this.model.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
    }
    async findByOwner(ownerId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { owner_id: ownerId }, pagination });
    }
    async findByTier(tier, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { tier }, pagination });
    }
    async getCompanyWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                owner: true,
                contacts: true,
                deals: { include: { contact: true } },
                projects: true,
            },
        });
    }
    async search(query, pagination = { page: 1, limit: 20 }) {
        return this.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { industry: { contains: query, mode: 'insensitive' } },
                    { city: { contains: query, mode: 'insensitive' } },
                ],
            },
            pagination,
        });
    }
    async getStats() {
        const [total, byTier, totalRevenue] = await Promise.all([
            this.model.count(),
            this.model.groupBy({ by: ['tier'], _count: true }),
            this.model.aggregate({ _sum: { annual_revenue: true } }),
        ]);
        return {
            total,
            byTier: byTier.reduce((acc, t) => ({ ...acc, [t.tier]: t._count }), {}),
            totalRevenue: totalRevenue._sum.annual_revenue || 0,
        };
    }
}
exports.CompanyRepository = CompanyRepository;
exports.companyRepository = new CompanyRepository();
//# sourceMappingURL=company.js.map