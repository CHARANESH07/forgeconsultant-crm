"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRepository = exports.TaskRepository = void 0;
const base_1 = require("./base");
class TaskRepository extends base_1.AbstractRepository {
    modelName = 'task';
    async findByAssignee(assigneeId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { assigned_to_id: assigneeId }, pagination });
    }
    async findByProject(projectId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { project_id: projectId }, pagination });
    }
    async findByStatus(status, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { status }, pagination });
    }
    async getTaskWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                project: true,
                assigned_to: true,
                created_by: true,
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
                ],
            },
            pagination,
        });
    }
    async toggleCompletion(id) {
        const task = await this.model.findUnique({ where: { id } });
        if (!task)
            throw new Error('Task not found');
        const isCompleted = task.status === 'completed';
        return this.model.update({
            where: { id },
            data: {
                status: isCompleted ? 'in_progress' : 'completed',
                completed_at: isCompleted ? null : new Date(),
            },
        });
    }
}
exports.TaskRepository = TaskRepository;
exports.taskRepository = new TaskRepository();
//# sourceMappingURL=task.js.map