import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class DocumentRepository extends AbstractRepository<
  any,
  Prisma.DocumentCreateInput,
  Prisma.DocumentUpdateInput,
  Prisma.DocumentWhereInput
> {
  protected modelName = 'document';

  async findByEntity(entityType: string, entityId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { related_entity_type: entityType, related_entity_id: entityId }, pagination });
  }

  async findByUploader(uploaderId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { uploaded_by_id: uploaderId }, pagination });
  }

  async getDocumentWithRelations(id: string) {
    return this.model.findUnique({
      where: { id },
      include: { uploaded_by: true },
    });
  }
}

export const documentRepository = new DocumentRepository();