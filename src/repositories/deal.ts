import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class DealRepository extends AbstractRepository<
  any,
  Prisma.DealCreateInput,
  Prisma.DealUpdateInput,
  Prisma.DealWhereInput
> {
  protected modelName = 'deal';

  async findByStage(stage: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { stage }, pagination });
  }

  async findByOwner(ownerId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { owner_id: ownerId }, pagination });
  }

  async findByCompany(companyId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { company_id: companyId }, pagination });
  }

  async getDealWithRelations(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        owner: true,
        proposals: true,
        originatingProjects: true,
      },
    });
  }

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { company: { name: { contains: query, mode: 'insensitive' } } },
          { contact: { first_name: { contains: query, mode: 'insensitive' } } },
          { service_type: { contains: query, mode: 'insensitive' } },
        ],
      },
      pagination,
    });
  }

  async getPipelineStats() {
    const [byStage, totalValue, wonValue, lostValue] = await Promise.all([
      this.model.groupBy({ by: ['stage'], _count: true, _sum: { amount: true } }),
      this.model.aggregate({ _sum: { amount: true } }),
      this.model.aggregate({ where: { stage: 'won' }, _sum: { amount: true } }),
      this.model.aggregate({ where: { stage: 'lost' }, _sum: { amount: true } }),
    ]);

    return {
      byStage: byStage.reduce((acc: Record<string, any>, s: any) => ({
        ...acc,
        [s.stage]: { count: s._count, value: s._sum.amount || 0 }
      }), {}),
      totalValue: totalValue._sum.amount || 0,
      wonValue: wonValue._sum.amount || 0,
      lostValue: lostValue._sum.amount || 0,
    };
  }

  async moveStage(dealId: string, newStage: string) {
    const deal = await this.model.findUnique({ where: { id: dealId } });
    if (!deal) throw new Error('Deal not found');

    let probability = 20;
    if (newStage === 'discovery') probability = 40;
    if (newStage === 'proposal') probability = 60;
    if (newStage === 'negotiation') probability = 85;
    if (newStage === 'won') probability = 100;
    if (newStage === 'lost') probability = 0;

    return this.model.update({
      where: { id: dealId },
      data: {
        stage: newStage as any,
        probability,
        closed_at: ['won', 'lost'].includes(newStage) ? new Date() : null,
      },
    });
  }
}

export const dealRepository = new DealRepository();