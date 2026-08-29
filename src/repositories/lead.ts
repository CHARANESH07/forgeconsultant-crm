import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class LeadRepository extends AbstractRepository<
  any,
  Prisma.LeadCreateInput,
  Prisma.LeadUpdateInput,
  Prisma.LeadWhereInput
> {
  protected modelName = 'lead';

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email } });
  }

  async findByStatus(status: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { status }, pagination });
  }

  async findByOwner(ownerId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { owner_id: ownerId }, pagination });
  }

  async findByCompany(companyName: string) {
    return this.model.findMany({ where: { company_name: { equals: companyName, mode: 'insensitive' } } });
  }

  async getLeadWithRelations(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });
  }

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
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
      byStatus: byStatus.reduce((acc: Record<string, number>, s: any) => ({ ...acc, [s.status]: s._count }), {}),
      avgScore: avgScore._avg.lead_score || 0,
      totalValue: totalValue._sum.estimated_value || 0,
    };
  }
}

export const leadRepository = new LeadRepository();