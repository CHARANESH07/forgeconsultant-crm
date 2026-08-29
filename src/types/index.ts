import { Prisma } from '@prisma/client';
import { Request } from 'express';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEAM_LEAD' | 'EMPLOYEE' | 'HR';

export type CRMRole =
  | 'CRM_ADMIN'
  | 'SALES'
  | 'BUSINESS_DEVELOPMENT'
  | 'MARKETING'
  | 'ACCOUNT_MANAGER'
  | 'CLIENT_RELATIONSHIP_MANAGER'
  | 'EMPLOYEE';

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

export const PERMISSIONS: PermissionMatrix = {
  leads: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'MARKETING', 'ACCOUNT_MANAGER', 'CLIENT_RELATIONSHIP_MANAGER', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  contacts: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'ACCOUNT_MANAGER', 'CLIENT_RELATIONSHIP_MANAGER'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'MARKETING', 'ACCOUNT_MANAGER', 'CLIENT_RELATIONSHIP_MANAGER', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'ACCOUNT_MANAGER', 'CLIENT_RELATIONSHIP_MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  companies: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'ACCOUNT_MANAGER'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'MARKETING', 'ACCOUNT_MANAGER', 'CLIENT_RELATIONSHIP_MANAGER', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'ACCOUNT_MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  deals: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'ACCOUNT_MANAGER'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'MARKETING', 'ACCOUNT_MANAGER', 'CLIENT_RELATIONSHIP_MANAGER', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'SALES', 'BUSINESS_DEVELOPMENT', 'ACCOUNT_MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  tasks: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    delete: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    ownOnly: true,
  },
  projects: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  employees: {
    create: ['SUPER_ADMIN', 'ADMIN'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'HR'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    delete: ['SUPER_ADMIN'],
    ownOnly: false,
  },
  attendance: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  leaves: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  documents: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    delete: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    ownOnly: true,
  },
  activities: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: false,
  },
  notifications: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
    ownOnly: true,
  },
  reports: {
    create: ['SUPER_ADMIN', 'ADMIN'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    update: ['SUPER_ADMIN', 'ADMIN'],
    delete: ['SUPER_ADMIN'],
    ownOnly: false,
  },
  settings: {
    create: ['SUPER_ADMIN', 'ADMIN'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'],
    update: ['SUPER_ADMIN', 'ADMIN'],
    delete: ['SUPER_ADMIN'],
    ownOnly: false,
  },
  meetings: {
    create: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    read: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    update: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    delete: ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD', 'EMPLOYEE'],
    ownOnly: true,
  },
};

const ROLE_ALIASES: Record<string, UserRole> = {
  'Employer/Admin': 'SUPER_ADMIN',
  'Team Lead': 'TEAM_LEAD',
  Lead: 'EMPLOYEE',
  HR: 'HR',
  employee: 'EMPLOYEE',
};

export function normalizeRole(role: string): UserRole {
  return ROLE_ALIASES[role] ?? (role as UserRole);
}

export function hasPermission(
  userRole: string,
  resource: keyof PermissionMatrix,
  action: 'create' | 'read' | 'update' | 'delete',
  isOwner: boolean = false
): boolean {
  const perm = PERMISSIONS[resource];
  if (!perm) return false;

  const allowedRoles = perm[action];
  if (!allowedRoles) return false;

  const role = normalizeRole(userRole);

  if (action !== 'read' && action !== 'create' && perm.ownOnly && !isOwner && !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    return false;
  }

  return allowedRoles.includes(role);
}

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

export function successResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, data, meta };
}

export function errorResponse(code: string, message: string, details?: unknown): ApiResponse {
  return { success: false, error: { code, message, details } };
}

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