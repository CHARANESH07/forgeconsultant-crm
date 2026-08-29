import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class ContactRepository extends AbstractRepository<
  any,
  Prisma.ContactCreateInput,
  Prisma.ContactUpdateInput,
  Prisma.ContactWhereInput
> {
  protected modelName = 'contact';

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email } });
  }

  async findByCompany(companyId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { company_id: companyId }, pagination });
  }

  async findByOwner(ownerId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { owner_id: ownerId }, pagination });
  }

  async getContactWithRelations(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        company: true,
        owner: true,
        deals: true,
      },
    });
  }

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({
      where: {
        OR: [
          { first_name: { contains: query, mode: 'insensitive' } },
          { last_name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { job_title: { contains: query, mode: 'insensitive' } },
          { company: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      pagination,
    });
  }
}

export const contactRepository = new ContactRepository();