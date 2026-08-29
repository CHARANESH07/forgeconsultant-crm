import { Request } from 'express';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEAM_LEAD' | 'EMPLOYEE' | 'HR';
export type CRMRole = 'CRM_ADMIN' | 'SALES' | 'BUSINESS_DEVELOPMENT' | 'MARKETING' | 'ACCOUNT_MANAGER' | 'CLIENT_RELATIONSHIP_MANAGER' | 'EMPLOYEE';
export type AllowedRole = UserRole | CRMRole;
export interface JWTPayload {
    userId: string;
    email: string;
    full_name: string;
    role: UserRole;
    organizationId: string;
    employeeId: string;
    crmRole: string;
    isSuperior: boolean;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}
export interface PermissionMatrix {
    [key: string]: {
        create?: AllowedRole[];
        read?: AllowedRole[];
        update?: AllowedRole[];
        delete?: AllowedRole[];
        ownOnly?: boolean;
    };
}
export declare const PERMISSIONS: PermissionMatrix;
export declare function normalizeRole(role: string): UserRole;
export declare function hasPermission(userRole: string, resource: keyof PermissionMatrix, action: 'create' | 'read' | 'update' | 'delete', isOwner?: boolean): boolean;
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: Record<string, unknown>;
}
export declare function successResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T>;
export declare function errorResponse(code: string, message: string, details?: unknown): ApiResponse;
export interface AuditLogInput {
    organizationId: string;
    action: string;
    entityType: string;
    entityId: string;
    entityTitle?: string;
    userName: string;
    details?: string;
    requestMeta?: Record<string, unknown>;
}
//# sourceMappingURL=index.d.ts.map