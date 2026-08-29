"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class AbstractRepository {
    modelName = 'employee';
    get model() {
        return prisma_1.default[this.modelName];
    }
    async create(data) {
        return this.model.create({ data });
    }
    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }
    async findMany(params) {
        const { where, pagination = { page: 1, limit: 20 }, orderBy, include } = params;
        const page = Math.max(1, pagination.page);
        const limit = Math.min(100, Math.max(1, pagination.limit));
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: orderBy,
                include: include,
            }),
            this.model.count({ where: where }),
        ]);
        return {
            data: data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async update(id, data) {
        return this.model.update({ where: { id }, data });
    }
    async delete(id) {
        return this.model.delete({ where: { id } });
    }
    async count(where) {
        return this.model.count({ where: where });
    }
    async findFirst(where, include) {
        return this.model.findFirst({ where: where, include });
    }
    async exists(id) {
        const count = await this.model.count({ where: { id } });
        return count > 0;
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=base.js.map