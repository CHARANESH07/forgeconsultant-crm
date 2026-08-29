import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const authSchemas = {
  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
  }),
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      fullName: z.string().min(2, 'Full name required'),
      employeeId: z.string().min(1, 'Employee ID required'),
    }),
  }),
  forgotPassword: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
    }),
  }),
  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, 'Reset token required'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    }).refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  }),
  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
      confirmPassword: z.string(),
    }).refine(data => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  }),
  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string().min(1).optional(),
    }),
  }),
};

export const leadSchemas = {
  create: z.object({
    body: z.object({
      firstName: z.string().min(1, 'First name required'),
      lastName: z.string().min(1, 'Last name required'),
      companyName: z.string().min(1, 'Company name required'),
      jobTitle: z.string().optional(),
      email: z.string().email('Invalid email'),
      phone: z.string().min(1, 'Phone required'),
      website: z.string().url().optional().or(z.literal('')),
      location: z.string().optional(),
      industry: z.string().optional(),
      leadSource: z.enum(['Website', 'LinkedIn', 'Referral', 'Event', 'Cold Outreach', 'Partner', 'Other']).default('Website'),
      estimatedValue: z.number().positive().optional(),
      notes: z.string().optional(),
    }),
  }),
  update: z.object({
    body: z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      companyName: z.string().min(1).optional(),
      jobTitle: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
      location: z.string().optional(),
      industry: z.string().optional(),
      leadSource: z.enum(['Website', 'LinkedIn', 'Referral', 'Event', 'Cold Outreach', 'Partner', 'Other']).optional(),
      status: z.enum(['new', 'contacted', 'qualified', 'nurturing', 'unqualified', 'converted']).optional(),
      leadScore: z.number().int().min(0).max(100).optional(),
      estimatedValue: z.number().positive().optional(),
      notes: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  convert: z.object({
    body: z.object({
      createDeal: z.boolean().default(true),
      dealAmount: z.number().positive().optional(),
      dealTitle: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      status: z.enum(['all', 'new', 'contacted', 'qualified', 'nurturing', 'unqualified', 'converted']).optional(),
      search: z.string().optional(),
      sortBy: z.enum(['score', 'value', 'date']).optional(),
    }),
  }),
};

export const contactSchemas = {
  create: z.object({
    body: z.object({
      firstName: z.string().min(1, 'First name required'),
      lastName: z.string().min(1, 'Last name required'),
      email: z.string().email('Invalid email'),
      phone: z.string().min(1, 'Phone required'),
      alternatePhone: z.string().optional(),
      jobTitle: z.string().min(1, 'Job title required'),
      companyId: z.string().uuid().optional(),
      city: z.string().optional(),
      country: z.string().default('India'),
      tags: z.array(z.string()).default([]),
      notes: z.string().optional(),
    }),
  }),
  update: z.object({
    body: z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      alternatePhone: z.string().optional(),
      jobTitle: z.string().optional(),
      companyId: z.string().uuid().optional().nullable(),
      city: z.string().optional(),
      country: z.string().optional(),
      tags: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      search: z.string().optional(),
    }),
  }),
};

export const companySchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Company name required'),
      industry: z.string().min(1, 'Industry required'),
      website: z.string().url().optional().or(z.literal('')),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().default('India'),
      employeesCount: z.string().optional(),
      annualRevenue: z.number().positive().optional(),
      tier: z.enum(['Enterprise', 'Strategic', 'Growth', 'Mid-Market']).default('Growth'),
      description: z.string().optional(),
    }),
  }),
  update: z.object({
    body: z.object({
      name: z.string().min(1).optional(),
      industry: z.string().min(1).optional(),
      website: z.string().url().optional().or(z.literal('')).nullable(),
      phone: z.string().optional().nullable(),
      email: z.string().email().optional().nullable(),
      city: z.string().optional().nullable(),
      state: z.string().optional().nullable(),
      country: z.string().optional(),
      employeesCount: z.string().optional().nullable(),
      annualRevenue: z.number().positive().optional().nullable(),
      tier: z.enum(['Enterprise', 'Strategic', 'Growth', 'Mid-Market']).optional(),
      description: z.string().optional().nullable(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      search: z.string().optional(),
      tier: z.enum(['all', 'Enterprise', 'Strategic', 'Growth', 'Mid-Market']).optional(),
    }),
  }),
};

export const dealSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, 'Deal title required'),
      companyId: z.string().uuid().optional(),
      contactId: z.string().uuid().optional(),
      amount: z.number().positive('Amount must be positive'),
      stage: z.enum(['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']).default('new'),
      probability: z.number().int().min(0).max(100).default(20),
      expectedCloseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
      serviceType: z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']),
      notes: z.string().optional(),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().min(1).optional(),
      companyId: z.string().uuid().optional().nullable(),
      contactId: z.string().uuid().optional().nullable(),
      amount: z.number().positive().optional(),
      stage: z.enum(['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']).optional(),
      probability: z.number().int().min(0).max(100).optional(),
      expectedCloseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      riskLevel: z.enum(['low', 'medium', 'high']).optional(),
      serviceType: z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']).optional(),
      notes: z.string().optional(),
      lostReason: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  moveStage: z.object({
    body: z.object({
      stage: z.enum(['new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      search: z.string().optional(),
      stage: z.enum(['all', 'new', 'discovery', 'proposal', 'negotiation', 'won', 'lost']).optional(),
      serviceType: z.string().optional(),
    }),
  }),
};

export const taskSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, 'Task title required'),
      description: z.string().optional(),
      projectId: z.string().uuid().optional(),
      assignedToId: z.string().uuid().optional(),
      dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
      dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      projectId: z.string().uuid().optional().nullable(),
      assignedToId: z.string().uuid().optional().nullable(),
      dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      status: z.enum(['not_started', 'in_progress', 'completed', 'cancelled']).optional(),
      progressPercent: z.number().int().min(0).max(100).optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      status: z.enum(['all', 'not_started', 'in_progress', 'completed', 'cancelled']).optional(),
      priority: z.enum(['all', 'low', 'medium', 'high', 'urgent']).optional(),
      search: z.string().optional(),
    }),
  }),
};

export const employeeSchemas = {
  create: z.object({
    body: z.object({
      employeeId: z.string().min(1, 'Employee ID required'),
      fullName: z.string().min(1, 'Full name required'),
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      designation: z.string().min(1, 'Designation required'),
      department: z.enum(['IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder']),
      crmRole: z.enum(['Employer/Admin', 'Team Lead', 'Lead', 'HR', 'employee']).default('employee'),
      underTeamLead: z.string().optional(),
      responsibleFor: z.string().optional(),
      joiningDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be DD/MM/YYYY'),
    }),
  }),
  update: z.object({
    body: z.object({
      fullName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      designation: z.string().min(1).optional(),
      department: z.enum(['IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder']).optional(),
      crmRole: z.enum(['Employer/Admin', 'Team Lead', 'Lead', 'HR', 'employee']).optional(),
      underTeamLead: z.string().optional().nullable(),
      responsibleFor: z.string().optional().nullable(),
      employmentStatus: z.enum(['Active', 'Inactive', 'On Leave']).optional(),
      isSuperior: z.boolean().optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      search: z.string().optional(),
      department: z.enum(['all', 'IT', 'Marketing', 'Sales', 'HR', 'Management', 'Founder']).optional(),
    }),
  }),
};

export const attendanceSchemas = {
  checkIn: z.object({
    body: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      ipAddress: z.string().optional(),
      location: z.string().optional(),
      notes: z.string().optional(),
    }),
  }),
  checkOut: z.object({
    body: z.object({
      ipAddress: z.string().optional(),
      notes: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      employeeId: z.string().uuid().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      status: z.enum(['all', 'Present', 'Absent', 'HalfDay', 'Leave', 'Holiday']).optional(),
    }),
  }),
};

export const leaveSchemas = {
  create: z.object({
    body: z.object({
      leaveType: z.enum(['Casual', 'Sick', 'Emergency', 'WFH']),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      reason: z.string().min(1, 'Reason required'),
    }),
  }),
  update: z.object({
    body: z.object({
      status: z.enum(['Pending', 'Approved', 'Rejected']),
      comments: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      employeeId: z.string().uuid().optional(),
      status: z.enum(['all', 'Pending', 'Approved', 'Rejected']).optional(),
      leaveType: z.enum(['all', 'Casual', 'Sick', 'Emergency', 'WFH']).optional(),
    }),
  }),
};

export const projectSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, 'Project title required'),
      clientId: z.string().uuid().optional(),
      originatingDealId: z.string().uuid().optional(),
      projectManagerId: z.string().uuid().optional(),
      status: z.enum(['Planning', 'InProgress', 'Review', 'Completed', 'OnHold']).default('InProgress'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('high'),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      budget: z.number().positive().optional(),
      description: z.string().optional(),
      serviceType: z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']).default('AI Development & Testing'),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().min(1).optional(),
      clientId: z.string().uuid().optional().nullable(),
      originatingDealId: z.string().uuid().optional().nullable(),
      projectManagerId: z.string().uuid().optional().nullable(),
      status: z.enum(['Planning', 'InProgress', 'Review', 'Completed', 'OnHold']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      budget: z.number().positive().optional().nullable(),
      progressPercent: z.number().int().min(0).max(100).optional(),
      description: z.string().optional().nullable(),
      serviceType: z.enum(['AI Development & Testing', 'Cybersecurity', 'Cloud & Data Analytics', 'Webstack Development', 'Strategic Consulting', 'Performance Testing']).optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      search: z.string().optional(),
      status: z.enum(['all', 'Planning', 'InProgress', 'Review', 'Completed', 'OnHold']).optional(),
    }),
  }),
};

export const activitySchemas = {
  create: z.object({
    body: z.object({
      type: z.enum(['call', 'email', 'meeting', 'task', 'note', 'deal_stage_changed', 'lead_converted', 'system']),
      title: z.string().min(1, 'Title required'),
      description: z.string().optional(),
      entityType: z.enum(['lead', 'contact', 'company', 'deal', 'project', 'general']),
      entityId: z.string().uuid().optional(),
      entityName: z.string().optional(),
    }),
  }),
  list: z.object({
    query: paginationSchema.extend({
      type: z.string().optional(),
      entityType: z.string().optional(),
      search: z.string().optional(),
    }),
  }),
};

export const documentSchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Document name required'),
      fileUrl: z.string().url('Invalid file URL'),
      fileType: z.string().min(1, 'File type required'),
      fileSize: z.number().int().positive('File size required'),
      category: z.enum(['SOW', 'Contract', 'Architecture', 'TestReport', 'Compliance', 'Other']),
      relatedEntityType: z.string().optional(),
      relatedEntityId: z.string().uuid().optional(),
      version: z.string().default('v1.0'),
    }),
  }),
  update: z.object({
    body: z.object({
      name: z.string().min(1).optional(),
      category: z.enum(['SOW', 'Contract', 'Architecture', 'TestReport', 'Compliance', 'Other']).optional(),
      version: z.string().optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      category: z.string().optional(),
      relatedEntityType: z.string().optional(),
      relatedEntityId: z.string().uuid().optional(),
    }),
  }),
};

export const meetingSchemas = {
  create: z.object({
    body: z.object({
      title: z.string().min(1, 'Meeting title required'),
      description: z.string().optional(),
      startTime: z.string().min(1, 'Start time required'),
      endTime: z.string().min(1, 'End time required'),
      location: z.string().optional(),
      meetingUrl: z.string().url().optional().or(z.literal('')),
      contactId: z.string().uuid().optional(),
      contactName: z.string().optional(),
      companyName: z.string().optional(),
      dealId: z.string().uuid().optional(),
      dealName: z.string().optional(),
      attendees: z.array(z.string()).default([]),
      status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
    }),
  }),
  update: z.object({
    body: z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      location: z.string().optional(),
      meetingUrl: z.string().url().optional().or(z.literal('')),
      contactId: z.string().uuid().optional().nullable(),
      contactName: z.string().optional().nullable(),
      companyName: z.string().optional().nullable(),
      dealId: z.string().uuid().optional().nullable(),
      dealName: z.string().optional().nullable(),
      attendees: z.array(z.string()).optional(),
      status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
    }),
    params: idParamSchema,
  }),
  list: z.object({
    query: paginationSchema.extend({
      status: z.enum(['all', 'scheduled', 'completed', 'cancelled']).optional(),
      search: z.string().optional(),
    }),
  }),
};

export const authRateLimit = () => {
  const limiter = require('express-rate-limit');
  return limiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
  });
};