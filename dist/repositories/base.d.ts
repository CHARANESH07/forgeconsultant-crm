import { PaginationParams, PaginatedResponse } from '../types';
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
export declare abstract class AbstractRepository<T, CreateInput, UpdateInput, WhereInput> implements BaseRepository<T, CreateInput, UpdateInput, WhereInput> {
    protected modelName: ModelName;
    protected get model(): any;
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
    findFirst(where: WhereInput, include?: Record<string, boolean | object>): Promise<T | null>;
    exists(id: string): Promise<boolean>;
}
//# sourceMappingURL=base.d.ts.map