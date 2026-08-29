"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepository = exports.ProjectRepository = void 0;
const base_1 = require("./base");
class ProjectRepository extends base_1.AbstractRepository {
    modelName = 'project';
    async findByManager(managerId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { project_manager_id: managerId }, pagination });
    }
    async findByClient(clientId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { client_id: clientId }, pagination });
    }
    async findByStatus(status, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { status }, pagination });
    }
    async getProjectWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                client: true,
                originating_deal: true,
                project_manager: true,
                milestones: true,
                tasks: true,
                dailyWorkLogs: true,
            },
        });
    }
    async search(query, pagination = { page: 1, limit: 20 }) {
        return this.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { service_type: { contains: query, mode: 'insensitive' } },
                ],
            },
            pagination,
        });
    }
}
exports.ProjectRepository = ProjectRepository;
exports.projectRepository = new ProjectRepository();
//# sourceMappingURL=project.js.map