"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = void 0;
exports.normalizeRole = normalizeRole;
exports.hasPermission = hasPermission;
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.PERMISSIONS = {
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
const ROLE_ALIASES = {
    'Employer/Admin': 'SUPER_ADMIN',
    'Team Lead': 'TEAM_LEAD',
    Lead: 'EMPLOYEE',
    HR: 'HR',
    employee: 'EMPLOYEE',
};
function normalizeRole(role) {
    return ROLE_ALIASES[role] ?? role;
}
function hasPermission(userRole, resource, action, isOwner = false) {
    const perm = exports.PERMISSIONS[resource];
    if (!perm)
        return false;
    const allowedRoles = perm[action];
    if (!allowedRoles)
        return false;
    const role = normalizeRole(userRole);
    if (action !== 'read' && action !== 'create' && perm.ownOnly && !isOwner && !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
        return false;
    }
    return allowedRoles.includes(role);
}
function successResponse(data, meta) {
    return { success: true, data, meta };
}
function errorResponse(code, message, details) {
    return { success: false, error: { code, message, details } };
}
//# sourceMappingURL=index.js.map