import { Prisma } from '@prisma/client';
export interface ServiceContext {
    userId: string;
    userRole: string;
    userEmail: string;
    userName: string;
    organizationId: string;
    employeeId: string;
    crmRole: string;
    isSuperior: boolean;
}
export declare class BaseService {
    protected context: ServiceContext;
    constructor(context: ServiceContext);
    protected checkPermission(resource: string, action: 'create' | 'read' | 'update' | 'delete', isOwner?: boolean): void;
    protected isAdmin(): boolean;
    protected canAccessRecord(ownerId?: string | null): boolean;
    protected logAudit(action: string, entityType: string, entityId: string, entityTitle: string, details?: string): Promise<void>;
}
export declare class LeadService extends BaseService {
    create(data: Prisma.LeadCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.LeadWhereInput;
        pagination?: any;
        sortBy?: string;
        sortOrder?: string;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: Prisma.LeadUpdateInput): Promise<any>;
    delete(id: string): Promise<void>;
    convert(leadId: string, options: {
        createDeal: boolean;
        dealAmount?: number;
        dealTitle?: string;
    }): Promise<{
        contact: {
            id: string;
            created_at: Date;
            updated_at: Date;
            email: string;
            phone: string;
            city: string | null;
            country: string | null;
            owner_id: string | null;
            notes: string | null;
            first_name: string;
            last_name: string;
            alternate_phone: string | null;
            job_title: string;
            company_id: string | null;
            tags: Prisma.JsonValue;
        };
        company: {
            name: string;
            id: string;
            created_at: Date;
            updated_at: Date;
            organization_id: string;
            description: string | null;
            email: string | null;
            phone: string | null;
            industry: string;
            website: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            employees_count: string | null;
            annual_revenue: number | null;
            tier: string;
            owner_id: string | null;
        };
        deal: {
            id: string;
            created_at: Date;
            updated_at: Date;
            owner_id: string | null;
            title: string;
            priority: string;
            service_type: string;
            notes: string | null;
            company_id: string | null;
            ai_summary: string | null;
            contact_id: string | null;
            amount: number;
            stage: string;
            probability: number;
            expected_close_date: string;
            risk_level: string | null;
            closed_at: Date | null;
            lost_reason: string | null;
        } | null;
    }>;
    getStats(): Promise<{
        total: any;
        byStatus: any;
        avgScore: any;
        totalValue: any;
    }>;
}
export declare class ContactService extends BaseService {
    create(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.ContactWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
}
export declare class CompanyService extends BaseService {
    create(data: Prisma.CompanyCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.CompanyWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: Prisma.CompanyUpdateInput): Promise<any>;
    delete(id: string): Promise<any>;
    getStats(): Promise<{
        total: any;
        byTier: any;
        totalRevenue: any;
    }>;
}
export declare class DealService extends BaseService {
    create(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.DealWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    moveStage(dealId: string, newStage: string): Promise<any>;
    getPipelineStats(): Promise<{
        byStage: any;
        totalValue: any;
        wonValue: any;
        lostValue: any;
    }>;
}
export declare class TaskService extends BaseService {
    create(data: any): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.TaskWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
    toggleCompletion(id: string): Promise<any>;
}
export declare class ProjectService extends BaseService {
    create(data: Prisma.ProjectCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.ProjectWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: Prisma.ProjectUpdateInput): Promise<any>;
    delete(id: string): Promise<any>;
}
export declare class EmployeeService extends BaseService {
    create(data: Prisma.EmployeeCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.EmployeeWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: Prisma.EmployeeUpdateInput): Promise<any>;
    delete(id: string): Promise<any>;
    search(query: string, pagination: any): Promise<import("../types").PaginatedResponse<any>>;
}
export declare class AttendanceService extends BaseService {
    checkIn(data: {
        date?: string;
        ipAddress?: string;
        location?: string;
        notes?: string;
    }): Promise<any>;
    checkOut(data: {
        ipAddress?: string;
        notes?: string;
    }): Promise<any>;
    findMany(params: {
        where?: Prisma.AttendanceWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    getToday(): Promise<any>;
}
export declare class LeaveService extends BaseService {
    create(data: Prisma.LeaveRequestCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.LeaveRequestWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    approve(id: string, comments?: string): Promise<any>;
    reject(id: string, comments?: string): Promise<any>;
}
export declare class DocumentService extends BaseService {
    create(data: Prisma.DocumentCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.DocumentWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: Prisma.DocumentUpdateInput): Promise<any>;
    delete(id: string): Promise<any>;
}
export declare class ActivityService extends BaseService {
    create(data: Prisma.ActivityCreateInput): Promise<any>;
    findByEntity(entityType: string, entityId: string, pagination: any): Promise<import("../types").PaginatedResponse<any>>;
    findMany(params: {
        where?: Prisma.ActivityWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    getRecent(limit?: number): Promise<any>;
}
export declare class NotificationService extends BaseService {
    findByUser(pagination: any): Promise<import("../types").PaginatedResponse<any>>;
    getUnreadCount(): Promise<any>;
    markAsRead(id: string): Promise<any>;
    markAllAsRead(): Promise<any>;
}
export declare class MeetingService extends BaseService {
    create(data: Prisma.MeetingCreateInput): Promise<any>;
    findById(id: string): Promise<any>;
    findMany(params: {
        where?: Prisma.MeetingWhereInput;
        pagination?: any;
    }): Promise<import("../types").PaginatedResponse<any>>;
    update(id: string, data: Prisma.MeetingUpdateInput): Promise<any>;
    delete(id: string): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map