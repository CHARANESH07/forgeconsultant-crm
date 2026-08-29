import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class CompanyRepository extends AbstractRepository<
  any,
  Prisma.CompanyCreateInput,
  Prisma.CompanyUpdateInput,
  Prisma.CompanyWhereInput
> {
  protected modelName = 'company';

  async findByName(name: string) {
    return this.model.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } });
  }

  async findByOwner(ownerId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { owner_id: ownerId }, pagination });
  }

  async findByTier(tier: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { tier }, pagination });
  }

  async getCompanyWithRelations(id: string) {
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

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
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
      byTier: byTier.reduce((acc: Record<string, number>, t: any) => ({ ...acc, [t.tier]: t._count }), {}),
      totalRevenue: totalRevenue._sum.annual_revenue || 0,
    };
  }
}

export const companyRepository = new CompanyRepository();