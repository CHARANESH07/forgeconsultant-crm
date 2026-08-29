"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingService = exports.NotificationService = exports.ActivityService = exports.DocumentService = exports.LeaveService = exports.AttendanceService = exports.EmployeeService = exports.ProjectService = exports.TaskService = exports.DealService = exports.CompanyService = exports.ContactService = exports.LeadService = exports.BaseService = void 0;
const prisma_1 = require("../utils/prisma");
const employee_1 = require("../repositories/employee");
const lead_1 = require("../repositories/lead");
const contact_1 = require("../repositories/contact");
const company_1 = require("../repositories/company");
const deal_1 = require("../repositories/deal");
const task_1 = require("../repositories/task");
const project_1 = require("../repositories/project");
const attendance_1 = require("../repositories/attendance");
const leave_1 = require("../repositories/leave");
const document_1 = require("../repositories/document");
const activity_1 = require("../repositories/activity");
const notification_1 = require("../repositories/notification");
const meeting_1 = require("../repositories/meeting");
const auditLog_1 = require("../repositories/auditLog");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
class BaseService {
    context;
    constructor(context) {
        this.context = context;
    }
    checkPermission(resource, action, isOwner = false) {
        if (!(0, types_1.hasPermission)(this.context.userRole, resource, action, isOwner)) {
            throw new errorHandler_1.AppError('FORBIDDEN', `Insufficient permissions to ${action} ${resource}`, 403);
        }
    }
    isAdmin() {
        const normalized = (0, types_1.normalizeRole)(this.context.userRole);
        return normalized === 'SUPER_ADMIN' || normalized === 'ADMIN';
    }
    canAccessRecord(ownerId) {
        if (this.isAdmin())
            return true;
        return ownerId === this.context.userId;
    }
    async logAudit(action, entityType, entityId, entityTitle, details) {
        await auditLog_1.auditLogRepository.log({
            organizationId: this.context.organizationId,
            action,
            entityType,
            entityId,
            entityTitle,
            userName: this.context.userName,
            details,
        });
    }
}
exports.BaseService = BaseService;
class LeadService extends BaseService {
    async create(data) {
        this.checkPermission('leads', 'create');
        const lead = await lead_1.leadRepository.create({
            ...data,
            owner: data.owner ?? { connect: { id: this.context.userId } },
        });
        await this.logAudit('LEAD_CREATED', 'Lead', lead.id, `${lead.first_name} ${lead.last_name}`, `Lead created with status: ${lead.status}`);
        return lead;
    }
    async findById(id) {
        this.checkPermission('leads', 'read');
        const lead = await lead_1.leadRepository.getLeadWithRelations(id);
        if (lead && !this.canAccessRecord(lead.owner_id))
            return null;
        return lead;
    }
    async findMany(params) {
        this.checkPermission('leads', 'read');
        const where = this.isAdmin()
            ? params.where
            : { ...params.where, owner_id: this.context.userId };
        return lead_1.leadRepository.findMany({
            ...params,
            where,
            include: { owner: { select: { full_name: true } } },
        });
    }
    async update(id, data) {
        const lead = await lead_1.leadRepository.findById(id);
        if (!lead)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Lead not found', 404);
        this.checkPermission('leads', 'update', lead.owner_id === this.context.userId);
        const updated = await lead_1.leadRepository.update(id, data);
        await this.logAudit('LEAD_UPDATED', 'Lead', id, `${lead.first_name} ${lead.last_name}`, 'Lead updated');
        return updated;
    }
    async delete(id) {
        const lead = await lead_1.leadRepository.findById(id);
        if (!lead)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Lead not found', 404);
        this.checkPermission('leads', 'delete', lead.owner_id === this.context.userId);
        await lead_1.leadRepository.delete(id);
        await this.logAudit('LEAD_DELETED', 'Lead', id, `${lead.first_name} ${lead.last_name}`, 'Lead deleted');
    }
    async convert(leadId, options) {
        this.checkPermission('leads', 'update');
        const lead = await lead_1.leadRepository.findById(leadId);
        if (!lead)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Lead not found', 404);
        return prisma_1.prisma.$transaction(async (tx) => {
            let company = await tx.company.findFirst({ where: { name: { equals: lead.company_name, mode: 'insensitive' } } });
            if (!company) {
                company = await tx.company.create({
                    data: {
                        organization_id: this.context.organizationId,
                        name: lead.company_name,
                        industry: lead.industry || 'Consulting Services',
                        website: lead.website,
                        phone: lead.phone,
                        email: lead.email,
                        tier: 'Growth',
                        owner_id: this.context.userId,
                    },
                });
            }
            const contact = await tx.contact.create({
                data: {
                    first_name: lead.first_name,
                    last_name: lead.last_name,
                    email: lead.email,
                    phone: lead.phone,
                    job_title: lead.job_title || 'Executive',
                    company_id: company.id,
                    owner_id: this.context.userId,
                    tags: ['Converted Lead'],
                    notes: lead.notes,
                },
            });
            let deal = null;
            if (options.createDeal) {
                deal = await tx.deal.create({
                    data: {
                        title: options.dealTitle || `${company.name} AI & Engineering Opportunity`,
                        company_id: company.id,
                        amount: options.dealAmount || lead.estimated_value || 3500000,
                        stage: 'new',
                        probability: 25,
                        expected_close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        owner_id: this.context.userId,
                        priority: 'high',
                        service_type: 'AI Development & Testing',
                        ai_summary: `Opportunity created via lead conversion for ${contact.first_name} ${contact.last_name}.`,
                    },
                });
            }
            await tx.lead.update({
                where: { id: leadId },
                data: {
                    status: 'converted',
                    converted_company_id: company.id,
                    converted_contact_id: contact.id,
                    converted_deal_id: deal?.id,
                },
            });
            await this.logAudit('LEAD_CONVERTED', 'Lead', leadId, `${lead.first_name} ${lead.last_name}`, `Converted to Contact (${contact.first_name}) & Account (${company.name})`);
            return { contact, company, deal };
        });
    }
    async getStats() {
        this.checkPermission('leads', 'read');
        return lead_1.leadRepository.getStats();
    }
}
exports.LeadService = LeadService;
class ContactService extends BaseService {
    async create(data) {
        this.checkPermission('contacts', 'create');
        const { company_id, ...rest } = data;
        return contact_1.contactRepository.create({
            ...rest,
            ...(company_id ? { company: { connect: { id: company_id } } } : {}),
            owner: rest.owner ?? { connect: { id: this.context.userId } },
        });
    }
    async findById(id) {
        this.checkPermission('contacts', 'read');
        const contact = await contact_1.contactRepository.getContactWithRelations(id);
        if (contact && !this.canAccessRecord(contact.owner_id))
            return null;
        return contact;
    }
    async findMany(params) {
        this.checkPermission('contacts', 'read');
        const where = this.isAdmin()
            ? params.where
            : { ...params.where, owner_id: this.context.userId };
        return contact_1.contactRepository.findMany({
            ...params,
            where,
            include: {
                company: { select: { name: true } },
                owner: { select: { full_name: true } },
            },
        });
    }
    async update(id, data) {
        const contact = await contact_1.contactRepository.findById(id);
        if (!contact)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Contact not found', 404);
        this.checkPermission('contacts', 'update', contact.owner_id === this.context.userId);
        const { company_id, ...rest } = data;
        const mapped = {
            ...rest,
            ...(company_id !== undefined
                ? company_id
                    ? { company: { connect: { id: company_id } } }
                    : { company: { disconnect: true } }
                : {}),
        };
        return contact_1.contactRepository.update(id, mapped);
    }
    async delete(id) {
        const contact = await contact_1.contactRepository.findById(id);
        if (!contact)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Contact not found', 404);
        this.checkPermission('contacts', 'delete', contact.owner_id === this.context.userId);
        return contact_1.contactRepository.delete(id);
    }
}
exports.ContactService = ContactService;
class CompanyService extends BaseService {
    async create(data) {
        this.checkPermission('companies', 'create');
        return company_1.companyRepository.create({
            ...data,
            organization: data.organization ?? { connect: { id: this.context.organizationId } },
            owner: data.owner ?? { connect: { id: this.context.userId } },
        });
    }
    async findById(id) {
        this.checkPermission('companies', 'read');
        const company = await company_1.companyRepository.getCompanyWithRelations(id);
        if (company && !this.canAccessRecord(company.owner_id))
            return null;
        return company;
    }
    async findMany(params) {
        this.checkPermission('companies', 'read');
        const where = this.isAdmin()
            ? params.where
            : { ...params.where, owner_id: this.context.userId };
        return company_1.companyRepository.findMany({
            ...params,
            where,
            include: { owner: { select: { full_name: true } } },
        });
    }
    async update(id, data) {
        const company = await company_1.companyRepository.findById(id);
        if (!company)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Company not found', 404);
        this.checkPermission('companies', 'update', company.owner_id === this.context.userId);
        return company_1.companyRepository.update(id, data);
    }
    async delete(id) {
        const company = await company_1.companyRepository.findById(id);
        if (!company)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Company not found', 404);
        this.checkPermission('companies', 'delete', company.owner_id === this.context.userId);
        return company_1.companyRepository.delete(id);
    }
    async getStats() {
        this.checkPermission('companies', 'read');
        return company_1.companyRepository.getStats();
    }
}
exports.CompanyService = CompanyService;
class DealService extends BaseService {
    async create(data) {
        this.checkPermission('deals', 'create');
        const { company_id, contact_id, ...rest } = data;
        const deal = await deal_1.dealRepository.create({
            ...rest,
            ...(company_id ? { company: { connect: { id: company_id } } } : {}),
            ...(contact_id ? { contact: { connect: { id: contact_id } } } : {}),
            owner: rest.owner ?? { connect: { id: this.context.userId } },
        });
        await this.logAudit('DEAL_CREATED', 'Deal', deal.id, deal.title, `Deal created in stage: ${deal.stage}`);
        return deal;
    }
    async findById(id) {
        this.checkPermission('deals', 'read');
        const deal = await deal_1.dealRepository.getDealWithRelations(id);
        if (deal && !this.canAccessRecord(deal.owner_id))
            return null;
        return deal;
    }
    async findMany(params) {
        this.checkPermission('deals', 'read');
        const where = this.isAdmin()
            ? params.where
            : { ...params.where, owner_id: this.context.userId };
        return deal_1.dealRepository.findMany({
            ...params,
            where,
            include: {
                company: { select: { name: true } },
                contact: { select: { first_name: true, last_name: true } },
                owner: { select: { full_name: true } },
            },
        });
    }
    async update(id, data) {
        const deal = await deal_1.dealRepository.findById(id);
        if (!deal)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Deal not found', 404);
        this.checkPermission('deals', 'update', deal.owner_id === this.context.userId);
        const { company_id, contact_id, ...rest } = data;
        const mapped = {
            ...rest,
            ...(company_id !== undefined
                ? company_id
                    ? { company: { connect: { id: company_id } } }
                    : { company: { disconnect: true } }
                : {}),
            ...(contact_id !== undefined
                ? contact_id
                    ? { contact: { connect: { id: contact_id } } }
                    : { contact: { disconnect: true } }
                : {}),
        };
        return deal_1.dealRepository.update(id, mapped);
    }
    async delete(id) {
        const deal = await deal_1.dealRepository.findById(id);
        if (!deal)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Deal not found', 404);
        this.checkPermission('deals', 'delete', deal.owner_id === this.context.userId);
        return deal_1.dealRepository.delete(id);
    }
    async moveStage(dealId, newStage) {
        const deal = await deal_1.dealRepository.findById(dealId);
        if (!deal)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Deal not found', 404);
        this.checkPermission('deals', 'update', deal.owner_id === this.context.userId);
        const updated = await deal_1.dealRepository.moveStage(dealId, newStage);
        await this.logAudit('DEAL_STAGE_CHANGED', 'Deal', dealId, deal.title, `Moved from ${deal.stage.toUpperCase()} to ${newStage.toUpperCase()}`);
        if (newStage === 'won') {
            await notification_1.notificationRepository.create({
                employee: { connect: { id: this.context.userId } },
                title: 'Deal Closed as Won!',
                message: `${deal.title} has been successfully closed for ₹${deal.amount.toLocaleString()}!`,
                type: 'deal',
                read: false,
                link: '/deals',
            });
        }
        return updated;
    }
    async getPipelineStats() {
        this.checkPermission('deals', 'read');
        return deal_1.dealRepository.getPipelineStats();
    }
}
exports.DealService = DealService;
class TaskService extends BaseService {
    async create(data) {
        this.checkPermission('tasks', 'create');
        const { assigned_to_id, project_id, ...rest } = data;
        if (assigned_to_id) {
            const assignee = await prisma_1.prisma.employee.findUnique({ where: { id: assigned_to_id } });
            if (!assignee || assignee.organization_id !== this.context.organizationId) {
                throw new errorHandler_1.AppError('INVALID_ASSIGNEE', 'Assignee not found in organization', 400);
            }
            if (!this.isAdmin() && assigned_to_id !== this.context.userId) {
                const assigner = await prisma_1.prisma.employee.findUnique({ where: { id: this.context.userId } });
                const sameTeam = assigner?.team_id && assignee.team_id && assigner.team_id === assignee.team_id;
                const sameDept = assigner?.department_id && assignee.department_id && assigner.department_id === assignee.department_id;
                if (!sameTeam && !sameDept) {
                    throw new errorHandler_1.AppError('FORBIDDEN', 'Not allowed to assign task outside your team', 403);
                }
            }
        }
        if (project_id) {
            const project = await prisma_1.prisma.project.findUnique({ where: { id: project_id } });
            if (!project || project.organization_id !== this.context.organizationId) {
                throw new errorHandler_1.AppError('INVALID_PROJECT', 'Project not found in organization', 400);
            }
        }
        return task_1.taskRepository.create({
            ...rest,
            ...(assigned_to_id ? { assigned_to: { connect: { id: assigned_to_id } } } : {}),
            ...(project_id ? { project: { connect: { id: project_id } } } : {}),
            created_by: { connect: { id: this.context.userId } },
        });
    }
    async findById(id) {
        this.checkPermission('tasks', 'read');
        const task = await task_1.taskRepository.getTaskWithRelations(id);
        if (task && !this.isAdmin() && task.assigned_to_id !== this.context.userId && task.created_by_id !== this.context.userId) {
            return null;
        }
        return task;
    }
    async findMany(params) {
        this.checkPermission('tasks', 'read');
        let where = params.where;
        if (!this.isAdmin()) {
            const ownClause = {
                OR: [{ assigned_to_id: this.context.userId }, { created_by_id: this.context.userId }],
            };
            where = params.where?.AND ? ({ AND: [...params.where.AND, ownClause] }) : (params.where ? { AND: [params.where, ownClause] } : ownClause);
        }
        return task_1.taskRepository.findMany({
            ...params,
            where,
            include: {
                assigned_to: { select: { full_name: true } },
                created_by: { select: { full_name: true } },
            },
        });
    }
    async update(id, data) {
        const task = await task_1.taskRepository.findById(id);
        if (!task)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Task not found', 404);
        this.checkPermission('tasks', 'update', task.assigned_to_id === this.context.userId || task.created_by_id === this.context.userId);
        const { assigned_to_id, project_id, ...rest } = data;
        if (assigned_to_id) {
            const assignee = await prisma_1.prisma.employee.findUnique({ where: { id: assigned_to_id } });
            if (!assignee || assignee.organization_id !== this.context.organizationId) {
                throw new errorHandler_1.AppError('INVALID_ASSIGNEE', 'Assignee not found in organization', 400);
            }
            if (!this.isAdmin() && assigned_to_id !== this.context.userId) {
                const assigner = await prisma_1.prisma.employee.findUnique({ where: { id: this.context.userId } });
                const sameTeam = assigner?.team_id && assignee.team_id && assigner.team_id === assignee.team_id;
                const sameDept = assigner?.department_id && assignee.department_id && assigner.department_id === assignee.department_id;
                if (!sameTeam && !sameDept) {
                    throw new errorHandler_1.AppError('FORBIDDEN', 'Not allowed to assign task outside your team', 403);
                }
            }
        }
        if (project_id) {
            const project = await prisma_1.prisma.project.findUnique({ where: { id: project_id } });
            if (!project || project.organization_id !== this.context.organizationId) {
                throw new errorHandler_1.AppError('INVALID_PROJECT', 'Project not found in organization', 400);
            }
        }
        const mapped = {
            ...rest,
            ...(assigned_to_id !== undefined
                ? assigned_to_id
                    ? { assigned_to: { connect: { id: assigned_to_id } } }
                    : { assigned_to: { disconnect: true } }
                : {}),
            ...(project_id !== undefined
                ? project_id
                    ? { project: { connect: { id: project_id } } }
                    : { project: { disconnect: true } }
                : {}),
        };
        return task_1.taskRepository.update(id, mapped);
    }
    async delete(id) {
        const task = await task_1.taskRepository.findById(id);
        if (!task)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Task not found', 404);
        this.checkPermission('tasks', 'delete', task.created_by_id === this.context.userId);
        return task_1.taskRepository.delete(id);
    }
    async toggleCompletion(id) {
        const task = await task_1.taskRepository.findById(id);
        if (!task)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Task not found', 404);
        this.checkPermission('tasks', 'update', task.assigned_to_id === this.context.userId || task.created_by_id === this.context.userId);
        return task_1.taskRepository.toggleCompletion(id);
    }
}
exports.TaskService = TaskService;
class ProjectService extends BaseService {
    async create(data) {
        this.checkPermission('projects', 'create');
        return project_1.projectRepository.create(data);
    }
    async findById(id) {
        this.checkPermission('projects', 'read');
        return project_1.projectRepository.getProjectWithRelations(id);
    }
    async findMany(params) {
        this.checkPermission('projects', 'read');
        return project_1.projectRepository.findMany(params);
    }
    async update(id, data) {
        const project = await project_1.projectRepository.findById(id);
        if (!project)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Project not found', 404);
        this.checkPermission('projects', 'update', project.project_manager_id === this.context.userId);
        return project_1.projectRepository.update(id, data);
    }
    async delete(id) {
        const project = await project_1.projectRepository.findById(id);
        if (!project)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Project not found', 404);
        this.checkPermission('projects', 'delete', project.project_manager_id === this.context.userId);
        return project_1.projectRepository.delete(id);
    }
}
exports.ProjectService = ProjectService;
class EmployeeService extends BaseService {
    async create(data) {
        this.checkPermission('employees', 'create');
        return employee_1.employeeRepository.create(data);
    }
    async findById(id) {
        this.checkPermission('employees', 'read');
        return employee_1.employeeRepository.getEmployeeWithRelations(id);
    }
    async findMany(params) {
        this.checkPermission('employees', 'read');
        return employee_1.employeeRepository.findMany(params);
    }
    async update(id, data) {
        this.checkPermission('employees', 'update');
        return employee_1.employeeRepository.update(id, data);
    }
    async delete(id) {
        this.checkPermission('employees', 'delete');
        return employee_1.employeeRepository.delete(id);
    }
    async search(query, pagination) {
        this.checkPermission('employees', 'read');
        return employee_1.employeeRepository.search(query, pagination);
    }
}
exports.EmployeeService = EmployeeService;
class AttendanceService extends BaseService {
    async checkIn(data) {
        this.checkPermission('attendance', 'create');
        const date = data.date || new Date().toISOString().split('T')[0];
        const existing = await attendance_1.attendanceRepository.findByEmployeeAndDate(this.context.employeeId, date);
        if (existing)
            throw new errorHandler_1.AppError('ALREADY_CHECKED_IN', 'Already checked in today', 409);
        return attendance_1.attendanceRepository.create({
            employee: { connect: { id: this.context.userId } },
            date,
            check_in: new Date(),
            status: 'Present',
            ip_address: data.ipAddress,
            location: data.location,
            notes: data.notes,
        });
    }
    async checkOut(data) {
        this.checkPermission('attendance', 'update');
        const date = new Date().toISOString().split('T')[0];
        const attendance = await attendance_1.attendanceRepository.findByEmployeeAndDate(this.context.employeeId, date);
        if (!attendance)
            throw new errorHandler_1.AppError('NOT_CHECKED_IN', 'Not checked in today', 404);
        if (attendance.check_out)
            throw new errorHandler_1.AppError('ALREADY_CHECKED_OUT', 'Already checked out', 409);
        const checkOutTime = new Date();
        const checkInTime = new Date(attendance.check_in);
        const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        return attendance_1.attendanceRepository.update(attendance.id, {
            check_out: checkOutTime,
            working_hours: Math.round(hours * 100) / 100,
            ip_address: data.ipAddress,
            notes: data.notes,
        });
    }
    async findMany(params) {
        this.checkPermission('attendance', 'read');
        return attendance_1.attendanceRepository.findMany(params);
    }
    async getToday() {
        this.checkPermission('attendance', 'read');
        return attendance_1.attendanceRepository.getTodayAttendance();
    }
}
exports.AttendanceService = AttendanceService;
class LeaveService extends BaseService {
    async create(data) {
        this.checkPermission('leaves', 'create');
        const days = Math.ceil((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return leave_1.leaveRepository.create({ ...data, employee: { connect: { id: this.context.userId } }, total_days: days });
    }
    async findById(id) {
        this.checkPermission('leaves', 'read');
        return leave_1.leaveRepository.getLeaveWithRelations(id);
    }
    async findMany(params) {
        this.checkPermission('leaves', 'read');
        return leave_1.leaveRepository.findMany(params);
    }
    async approve(id, comments) {
        const leave = await leave_1.leaveRepository.findById(id);
        if (!leave)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Leave request not found', 404);
        this.checkPermission('leaves', 'update');
        return leave_1.leaveRepository.update(id, {
            status: 'Approved',
            approved_by: { connect: { id: this.context.userId } },
            decision_date: new Date(),
            comments,
        });
    }
    async reject(id, comments) {
        const leave = await leave_1.leaveRepository.findById(id);
        if (!leave)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Leave request not found', 404);
        this.checkPermission('leaves', 'update');
        return leave_1.leaveRepository.update(id, {
            status: 'Rejected',
            approved_by: { connect: { id: this.context.userId } },
            decision_date: new Date(),
            comments,
        });
    }
}
exports.LeaveService = LeaveService;
class DocumentService extends BaseService {
    async create(data) {
        this.checkPermission('documents', 'create');
        return document_1.documentRepository.create({ ...data, uploaded_by: { connect: { id: this.context.userId } } });
    }
    async findById(id) {
        this.checkPermission('documents', 'read');
        return document_1.documentRepository.getDocumentWithRelations(id);
    }
    async findMany(params) {
        this.checkPermission('documents', 'read');
        return document_1.documentRepository.findMany(params);
    }
    async update(id, data) {
        const doc = await document_1.documentRepository.findById(id);
        if (!doc)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Document not found', 404);
        this.checkPermission('documents', 'update', doc.uploaded_by_id === this.context.userId);
        return document_1.documentRepository.update(id, data);
    }
    async delete(id) {
        const doc = await document_1.documentRepository.findById(id);
        if (!doc)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Document not found', 404);
        this.checkPermission('documents', 'delete', doc.uploaded_by_id === this.context.userId);
        return document_1.documentRepository.delete(id);
    }
}
exports.DocumentService = DocumentService;
class ActivityService extends BaseService {
    async create(data) {
        this.checkPermission('activities', 'create');
        return activity_1.activityRepository.create({ ...data, user_id: this.context.userId, user_name: this.context.userName });
    }
    async findByEntity(entityType, entityId, pagination) {
        this.checkPermission('activities', 'read');
        return activity_1.activityRepository.findByEntity(entityType, entityId, pagination);
    }
    async findMany(params) {
        this.checkPermission('activities', 'read');
        return activity_1.activityRepository.findMany(params);
    }
    async getRecent(limit = 20) {
        this.checkPermission('activities', 'read');
        return activity_1.activityRepository.getRecentActivity(limit);
    }
}
exports.ActivityService = ActivityService;
class NotificationService extends BaseService {
    async findByUser(pagination) {
        this.checkPermission('notifications', 'read');
        return notification_1.notificationRepository.findByUser(this.context.userId, pagination);
    }
    async getUnreadCount() {
        this.checkPermission('notifications', 'read');
        return notification_1.notificationRepository.getUnreadCount(this.context.userId);
    }
    async markAsRead(id) {
        this.checkPermission('notifications', 'update');
        return notification_1.notificationRepository.markAsRead(id);
    }
    async markAllAsRead() {
        this.checkPermission('notifications', 'update');
        return notification_1.notificationRepository.markAllAsRead(this.context.userId);
    }
}
exports.NotificationService = NotificationService;
class MeetingService extends BaseService {
    async create(data) {
        this.checkPermission('meetings', 'create');
        return meeting_1.meetingRepository.create({
            ...data,
            host_id: this.context.userId,
            host_name: this.context.userName,
        });
    }
    async findById(id) {
        this.checkPermission('meetings', 'read');
        const meeting = await meeting_1.meetingRepository.findById(id);
        if (meeting && !this.isAdmin() && meeting.host_id !== this.context.userId) {
            const attendees = Array.isArray(meeting.attendees) ? meeting.attendees : [];
            if (!attendees.includes(this.context.userEmail))
                return null;
        }
        return meeting;
    }
    async findMany(params) {
        this.checkPermission('meetings', 'read');
        let where = params.where;
        if (!this.isAdmin()) {
            where = params.where ? { AND: [params.where, { host_id: this.context.userId }] } : { host_id: this.context.userId };
        }
        return meeting_1.meetingRepository.findMany({ ...params, where, orderBy: { start_time: 'desc' } });
    }
    async update(id, data) {
        const meeting = await meeting_1.meetingRepository.findById(id);
        if (!meeting)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Meeting not found', 404);
        this.checkPermission('meetings', 'update', meeting.host_id === this.context.userId);
        return meeting_1.meetingRepository.update(id, data);
    }
    async delete(id) {
        const meeting = await meeting_1.meetingRepository.findById(id);
        if (!meeting)
            throw new errorHandler_1.AppError('NOT_FOUND', 'Meeting not found', 404);
        this.checkPermission('meetings', 'delete', meeting.host_id === this.context.userId);
        return meeting_1.meetingRepository.delete(id);
    }
}
exports.MeetingService = MeetingService;
//# sourceMappingURL=index.js.map