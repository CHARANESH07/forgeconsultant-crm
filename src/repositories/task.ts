import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class TaskRepository extends AbstractRepository<
  any,
  Prisma.TaskCreateInput,
  Prisma.TaskUpdateInput,
  Prisma.TaskWhereInput
> {
  protected modelName = 'task';

  async findByAssignee(assigneeId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { assigned_to_id: assigneeId }, pagination });
  }

  async findByProject(projectId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { project_id: projectId }, pagination });
  }

  async findByStatus(status: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { status }, pagination });
  }

  async getTaskWithRelations(id: string) {
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

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
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

  async toggleCompletion(id: string) {
    const task = await this.model.findUnique({ where: { id } });
    if (!task) throw new Error('Task not found');

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

export const taskRepository = new TaskRepository();