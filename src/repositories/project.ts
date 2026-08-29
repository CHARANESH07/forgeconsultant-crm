import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class ProjectRepository extends AbstractRepository<
  any,
  Prisma.ProjectCreateInput,
  Prisma.ProjectUpdateInput,
  Prisma.ProjectWhereInput
> {
  protected modelName = 'project';

  async findByManager(managerId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { project_manager_id: managerId }, pagination });
  }

  async findByClient(clientId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { client_id: clientId }, pagination });
  }

  async findByStatus(status: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { status }, pagination });
  }

  async getProjectWithRelations(id: string) {
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

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
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

export const projectRepository = new ProjectRepository();