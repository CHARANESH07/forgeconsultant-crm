import { AbstractRepository } from './base';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types';
export declare class MeetingRepository extends AbstractRepository<any, Prisma.MeetingCreateInput, Prisma.MeetingUpdateInput, Prisma.MeetingWhereInput> {
    protected modelName: string;
    findByHost(hostId: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
    findByStatus(status: string, pagination?: PaginationParams): Promise<import("../types").PaginatedResponse<any>>;
}
export declare const meetingRepository: MeetingRepository;
//# sourceMappingURL=meeting.d.ts.map