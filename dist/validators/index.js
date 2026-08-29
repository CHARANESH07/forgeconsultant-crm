"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = exports.meetingSchemas = exports.documentSchemas = exports.activitySchemas = exports.projectSchemas = exports.leaveSchemas = exports.attendanceSchemas = exports.employeeSchemas = exports.taskSchemas = exports.dealSchemas = exports.companySchemas = exports.contactSchemas = exports.leadSchemas = exports.authSchemas = exports.idParamSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid ID format'),
});
exports.authSchemas = {
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format'),
            password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
        }),
    }),
    register: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format'),
            password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
            fullName: zod_1.z.string().min(2, 'Full name required'),
            employeeId: zod_1.z.string().min(1, 'Employee ID required'),
        }),
    }),
    forgotPassword: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format'),
        }),
    }),
    resetPassword: zod_1.z.object({
        body: zod_1.z.object({
            token: zod_1.z.string().min(1, 'Reset token required'),
            password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
            confirmPassword: zod_1.z.string(),
        }).refine(data => data.password === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        }),
    }),
    changePassword: zod_1.z.object({
        body: zod_1.z.object({
            currentPassword: zod_1.z.string().min(1, 'Current password required'),
            newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters'),
            confirmPassword: zod_1.z.string(),
        }).refine(data => data.newPassword === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        }),
    }),
    refreshToken: zod_1.z.object({
        body: zod_1.z.object({
            refreshToken: zod_1.z.string().min(1).optional(),
        }),
    }),
};
exports.leadSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string().min(1, 'First name required'),
            lastName: zod_1.z.string().min(1, 'Last name required'),
            companyName: zod_1.z.string().min(1, 'Company name required'),
            jobTitle: zod_1.z.string().optional(),
            email: zod_1.z.string().email('Invalid email'),
            phone: zod_1.z.string().min(1, 'Phone required'),
            website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
            location: zod_1.z.string().optional(),
            industry: zod_1.z.string().optional(),
            leadSource: zod_1.z.enum(['Website', 'LinkedIn', 'Referral', 'Event', 'Cold Outreach', 'Partner', 'Other']).default('Website'),
            estimatedValue: zod_1.z.number().positive().optional(),
            notes: zod_1.z.string().optional(),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string().min(1).optional(),
            lastName: zod_1.z.string().min(1).optional(),
            companyName: zod_1.z.string().min(1).optional(),
            jobTitle: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            phone: zod_1.z.string().optional(),
            website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
            location: zod_1.z.string().optional(),
            industry: zod_1.z.string().optional(),
            leadSource: zod_1.z.enum(['Website', 'LinkedIn', 'Referral', 'Event', 'Cold Outreach', 'Partner', 'Other']).optional(),
            status: zod_1.z.enum(['new', 'contacted', 'qualified', 'nurturing', 'unqualified', 'converted']).optional(),
            leadScore: zod_1.z.number().int().min(0).max(100).optional(),
            estimatedValue: zod_1.z.number().positive().optional(),
            notes: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    convert: zod_1.z.object({
        body: zod_1.z.object({
            createDeal: zod_1.z.boolean().default(true),
            dealAmount: zod_1.z.number().positive().optional(),
            dealTitle: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            status: zod_1.z.enum(['all', 'new', 'contacted', 'qualified', 'nurturing', 'unqualified', 'converted']).optional(),
            search: zod_1.z.string().optional(),
            sortBy: zod_1.z.enum(['score', 'value', 'date']).optional(),
        }),
    }),
};
exports.contactSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string().min(1, 'First name required'),
            lastName: zod_1.z.string().min(1, 'Last name required'),
            email: zod_1.z.string().email('Invalid email'),
            phone: zod_1.z.string().min(1, 'Phone required'),
            alternatePhone: zod_1.z.string().optional(),
            jobTitle: zod_1.z.string().min(1, 'Job title required'),
            companyId: zod_1.z.string().uuid().optional(),
            city: zod_1.z.string().optional(),
            country: zod_1.z.string().default('India'),
            tags: zod_1.z.array(zod_1.z.string()).default([]),
            notes: zod_1.z.string().optional(),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            firstName: zod_1.z.string().min(1).optional(),
            lastName: zod_1.z.string().min(1).optional(),
            email: zod_1.z.string().email().optional(),
            phone: zod_1.z.string().optional(),
            alternatePhone: zod_1.z.string().optional(),
            jobTitle: zod_1.z.string().optional(),
            companyId: zod_1.z.string().uuid().optional().nullable(),
            city: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
            notes: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            search: zod_1.z.string().optional(),
        }),
    }),
};
exports.companySchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(1, 'Company name required'),
            industry: zod_1.z.string().min(1, 'Industry required'),
            website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
            phone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            city: zod_1.z.string().optional(),
            state: zod_1.z.string().optional(),
            country: zod_1.z.string().default('India'),
            employeesCount: zod_1.z.string().optional(),
            annualRevenue: zod_1.z.number().positive().optional(),
            tier: zod_1.z.enum(['Enterprise', 'Strategic', 'Growth', 'Mid-Market']).default('Growth'),
            description: zod_1.z.string().optional(),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(1).optional(),
            industry: zod_1.z.string().min(1).optional(),
            website: zod_1.z.string().url().optional().or(zod_1.z.literal('')).nullable(),
            phone: zod_1.z.string().optional().nullable(),
            email: zod_1.z.string().email().optional().nullable(),
            city: zod_1.z.string().optional().nullable(),
            state: zod_1.z.string().optional().nullable(),
            country: zod_1.z.string().optional(),
            employeesCount: zod_1.z.string().optional().nullable(),
            annualRevenue: zod_1.z.number().positive().optional().nullable(),
            tier: zod_1.z.enum(['Enterprise', 'Strategic', 'Growth', 'Mid-Market']).optional(),
            description: zod_1.z.string().optional().nullable(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            search: zod_1.z.string().optional(),
            tier: zod_1.z.enum(['all', 'Enterprise', 'Strategic', 'Growth', 'Mid-Market']).optional(),
        }),
    }),
};
exports.dealSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1, 'Deal title required'),
            companyId: zod_1.z.string().uuid().optional(),
            contactId: zod_1.z.string().uuid().optional(),
            amount: zod_1.z.number().positive('Amount must be positive'),
            stage: zod_1.z.enum(['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']).default('new'),
            probability: zod_1.z.number().int().min(0).max(100).default(20),
            expectedCloseDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
            priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
            serviceType: zod_1.z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']),
            notes: zod_1.z.string().optional(),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1).optional(),
            companyId: zod_1.z.string().uuid().optional().nullable(),
            contactId: zod_1.z.string().uuid().optional().nullable(),
            amount: zod_1.z.number().positive().optional(),
            stage: zod_1.z.enum(['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']).optional(),
            probability: zod_1.z.number().int().min(0).max(100).optional(),
            expectedCloseDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
            riskLevel: zod_1.z.enum(['low', 'medium', 'high']).optional(),
            serviceType: zod_1.z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']).optional(),
            notes: zod_1.z.string().optional(),
            lostReason: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    moveStage: zod_1.z.object({
        body: zod_1.z.object({
            stage: zod_1.z.enum(['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            search: zod_1.z.string().optional(),
            stage: zod_1.z.enum(['all', 'new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']).optional(),
            serviceType: zod_1.z.string().optional(),
        }),
    }),
};
exports.taskSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1, 'Task title required'),
            description: zod_1.z.string().optional(),
            projectId: zod_1.z.string().uuid().optional(),
            assignedToId: zod_1.z.string().uuid().optional(),
            dueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
            dueTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional(),
            priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1).optional(),
            description: zod_1.z.string().optional(),
            projectId: zod_1.z.string().uuid().optional().nullable(),
            assignedToId: zod_1.z.string().uuid().optional().nullable(),
            dueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            dueTime: zod_1.z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
            priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
            status: zod_1.z.enum(['not_started', 'in_progress', 'completed', 'cancelled']).optional(),
            progressPercent: zod_1.z.number().int().min(0).max(100).optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            status: zod_1.z.enum(['all', 'not_started', 'in_progress', 'completed', 'cancelled']).optional(),
            priority: zod_1.z.enum(['all', 'low', 'medium', 'high', 'urgent']).optional(),
            search: zod_1.z.string().optional(),
        }),
    }),
};
exports.employeeSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            employeeId: zod_1.z.string().min(1, 'Employee ID required'),
            fullName: zod_1.z.string().min(1, 'Full name required'),
            email: zod_1.z.string().email('Invalid email'),
            password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
            designation: zod_1.z.string().min(1, 'Designation required'),
            department: zod_1.z.enum(['IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder']),
            crmRole: zod_1.z.enum(['Employer/Admin', 'Team Lead', 'Lead', 'HR', 'employee']).default('employee'),
            underTeamLead: zod_1.z.string().optional(),
            responsibleFor: zod_1.z.string().optional(),
            joiningDate: zod_1.z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be DD/MM/YYYY'),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            fullName: zod_1.z.string().min(1).optional(),
            email: zod_1.z.string().email().optional(),
            designation: zod_1.z.string().min(1).optional(),
            department: zod_1.z.enum(['IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder']).optional(),
            crmRole: zod_1.z.enum(['Employer/Admin', 'Team Lead', 'Lead', 'HR', 'employee']).optional(),
            underTeamLead: zod_1.z.string().optional().nullable(),
            responsibleFor: zod_1.z.string().optional().nullable(),
            employmentStatus: zod_1.z.enum(['Active', 'Inactive', 'On Leave']).optional(),
            isSuperior: zod_1.z.boolean().optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            search: zod_1.z.string().optional(),
            department: zod_1.z.enum(['all', 'IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder']).optional(),
        }),
    }),
};
exports.attendanceSchemas = {
    checkIn: zod_1.z.object({
        body: zod_1.z.object({
            date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            ipAddress: zod_1.z.string().optional(),
            location: zod_1.z.string().optional(),
            notes: zod_1.z.string().optional(),
        }),
    }),
    checkOut: zod_1.z.object({
        body: zod_1.z.object({
            ipAddress: zod_1.z.string().optional(),
            notes: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            employeeId: zod_1.z.string().uuid().optional(),
            startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            status: zod_1.z.enum(['all', 'Present', 'Absent', 'HalfDay', 'Leave', 'Holiday']).optional(),
        }),
    }),
};
exports.leaveSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            leaveType: zod_1.z.enum(['Casual', 'Sick', 'Emergency', 'WFH']),
            startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            reason: zod_1.z.string().min(1, 'Reason required'),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            status: zod_1.z.enum(['Pending', 'Approved', 'Rejected']),
            comments: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            employeeId: zod_1.z.string().uuid().optional(),
            status: zod_1.z.enum(['all', 'Pending', 'Approved', 'Rejected']).optional(),
            leaveType: zod_1.z.enum(['all', 'Casual', 'Sick', 'Emergency', 'WFH']).optional(),
        }),
    }),
};
exports.projectSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1, 'Project title required'),
            clientId: zod_1.z.string().uuid().optional(),
            originatingDealId: zod_1.z.string().uuid().optional(),
            projectManagerId: zod_1.z.string().uuid().optional(),
            status: zod_1.z.enum(['Planning', 'InProgress', 'Review', 'Completed', 'OnHold']).default('InProgress'),
            priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).default('high'),
            startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            budget: zod_1.z.number().positive().optional(),
            description: zod_1.z.string().optional(),
            serviceType: zod_1.z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']).default('AI Development & Testing'),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1).optional(),
            clientId: zod_1.z.string().uuid().optional().nullable(),
            originatingDealId: zod_1.z.string().uuid().optional().nullable(),
            projectManagerId: zod_1.z.string().uuid().optional().nullable(),
            status: zod_1.z.enum(['Planning', 'InProgress', 'Review', 'Completed', 'OnHold']).optional(),
            priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
            startDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            endDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            budget: zod_1.z.number().positive().optional().nullable(),
            progressPercent: zod_1.z.number().int().min(0).max(100).optional(),
            description: zod_1.z.string().optional().nullable(),
            serviceType: zod_1.z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']).optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            search: zod_1.z.string().optional(),
            status: zod_1.z.enum(['all', 'Planning', 'InProgress', 'Review', 'Completed', 'OnHold']).optional(),
        }),
    }),
};
exports.activitySchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            type: zod_1.z.enum(['call', 'email', 'meeting', 'task', 'note', 'deal_stage_changed', 'lead_converted', 'system']),
            title: zod_1.z.string().min(1, 'Title required'),
            description: zod_1.z.string().optional(),
            entityType: zod_1.z.enum(['lead', 'contact', 'company', 'deal', 'project', 'general']),
            entityId: zod_1.z.string().uuid().optional(),
            entityName: zod_1.z.string().optional(),
        }),
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            type: zod_1.z.string().optional(),
            entityType: zod_1.z.string().optional(),
            search: zod_1.z.string().optional(),
        }),
    }),
};
exports.documentSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(1, 'Document name required'),
            fileUrl: zod_1.z.string().url('Invalid file URL'),
            fileType: zod_1.z.string().min(1, 'File type required'),
            fileSize: zod_1.z.number().int().positive('File size required'),
            category: zod_1.z.enum(['SOW', 'Contract', 'Architecture', 'TestReport', 'Compliance', 'Other']),
            relatedEntityType: zod_1.z.string().optional(),
            relatedEntityId: zod_1.z.string().uuid().optional(),
            version: zod_1.z.string().default('v1.0'),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            name: zod_1.z.string().min(1).optional(),
            category: zod_1.z.enum(['SOW', 'Contract', 'Architecture', 'TestReport', 'Compliance', 'Other']).optional(),
            version: zod_1.z.string().optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            category: zod_1.z.string().optional(),
            relatedEntityType: zod_1.z.string().optional(),
            relatedEntityId: zod_1.z.string().uuid().optional(),
        }),
    }),
};
exports.meetingSchemas = {
    create: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1, 'Meeting title required'),
            description: zod_1.z.string().optional(),
            startTime: zod_1.z.string().min(1, 'Start time required'),
            endTime: zod_1.z.string().min(1, 'End time required'),
            location: zod_1.z.string().optional(),
            meetingUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
            contactId: zod_1.z.string().uuid().optional(),
            contactName: zod_1.z.string().optional(),
            companyName: zod_1.z.string().optional(),
            dealId: zod_1.z.string().uuid().optional(),
            dealName: zod_1.z.string().optional(),
            attendees: zod_1.z.array(zod_1.z.string()).default([]),
            status: zod_1.z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
        }),
    }),
    update: zod_1.z.object({
        body: zod_1.z.object({
            title: zod_1.z.string().min(1).optional(),
            description: zod_1.z.string().optional(),
            startTime: zod_1.z.string().optional(),
            endTime: zod_1.z.string().optional(),
            location: zod_1.z.string().optional(),
            meetingUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
            contactId: zod_1.z.string().uuid().optional().nullable(),
            contactName: zod_1.z.string().optional().nullable(),
            companyName: zod_1.z.string().optional().nullable(),
            dealId: zod_1.z.string().uuid().optional().nullable(),
            dealName: zod_1.z.string().optional().nullable(),
            attendees: zod_1.z.array(zod_1.z.string()).optional(),
            status: zod_1.z.enum(['scheduled', 'completed', 'cancelled']).optional(),
        }),
        params: exports.idParamSchema,
    }),
    list: zod_1.z.object({
        query: exports.paginationSchema.extend({
            status: zod_1.z.enum(['all', 'scheduled', 'completed', 'cancelled']).optional(),
            search: zod_1.z.string().optional(),
        }),
    }),
};
const authRateLimit = () => {
    const limiter = require('express-rate-limit');
    return limiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per window
        message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
    });
};
exports.authRateLimit = authRateLimit;
//# sourceMappingURL=index.js.map