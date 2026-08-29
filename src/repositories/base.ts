import { PrismaClient } from '@prisma/client';
import { PaginationParams, PaginatedResponse } from '@/types';
import prisma from '@/utils/prisma';

export type ModelName = string;

export interface BaseRepository<T, CreateInput, UpdateInput, WhereInput> {
  create(data: CreateInput): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(params: {
    where?: WhereInput;
    pagination?: PaginationParams;
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: Record<string, boolean | object>;
  }): Promise<PaginatedResponse<T>>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
  count(where?: WhereInput): Promise<number>;
}

export abstract class AbstractRepository<T, CreateInput, UpdateInput, WhereInput> implements BaseRepository<T, CreateInput, UpdateInput, WhereInput> {
  protected modelName: ModelName = 'employee';
  protected get model() {
    return (prisma as any)[this.modelName];
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data }) as Promise<T>;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } }) as Promise<T | null>;
  }

  async findMany(params: {
    where?: WhereInput;
    pagination?: PaginationParams;
    orderBy?: Record<string, 'asc' | 'desc'>;
    include?: Record<string, boolean | object>;
  }): Promise<PaginatedResponse<T>> {
    const { where, pagination = { page: 1, limit: 20 }, orderBy, include } = params;
    const page = Math.max(1, pagination.page);
    const limit = Math.min(100, Math.max(1, pagination.limit));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: orderBy as any,
        include: include as any,
      }),
      this.model.count({ where: where as any }),
    ]);

    return {
      data: data as T[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({ where: { id }, data }) as Promise<T>;
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } }) as Promise<T>;
  }

  async count(where?: WhereInput): Promise<number> {
    return this.model.count({ where: where as any });
  }

  async findFirst(where: WhereInput, include?: Record<string, boolean | object>): Promise<T | null> {
    return this.model.findFirst({ where: where as any, include }) as Promise<T | null>;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }
}