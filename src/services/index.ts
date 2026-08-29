import { prisma } from '@/utils/prisma';
import { employeeRepository } from '@/repositories/employee';
import { leadRepository } from '@/repositories/lead';
import { contactRepository } from '@/repositories/contact';
import { companyRepository } from '@/repositories/company';
import { dealRepository } from '@/repositories/deal';
import { taskRepository } from '@/repositories/task';
import { projectRepository } from '@/repositories/project';
import { attendanceRepository } from '@/repositories/attendance';
import { leaveRepository } from '@/repositories/leave';
import { documentRepository } from '@/repositories/document';
import { activityRepository } from '@/repositories/activity';
import { notificationRepository } from '@/repositories/notification';
import { meetingRepository } from '@/repositories/meeting';
import { auditLogRepository } from '@/repositories/auditLog';
import { AppError } from '@/middleware/errorHandler';
import { Prisma } from '@prisma/client';
import { hasPermission, normalizeRole } from '@/types';

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

export class BaseService {
  protected context: ServiceContext;

  constructor(context: ServiceContext) {
    this.context = context;
  }

  protected checkPermission(resource: string, action: 'create' | 'read' | 'update' | 'delete', isOwner: boolean = false): void {
    if (!hasPermission(this.context.userRole as any, resource as any, action, isOwner)) {
      throw new AppError('FORBIDDEN', `Insufficient permissions to ${action} ${resource}`, 403);
    }
  }

  protected isAdmin(): boolean {
    const normalized = normalizeRole(this.context.userRole);
    return normalized === 'SUPER_ADMIN' || normalized === 'ADMIN';
  }

  protected canAccessRecord(ownerId?: string | null): boolean {
    if (this.isAdmin()) return true;
    return ownerId === this.context.userId;
  }

  protected async logAudit(action: string, entityType: string, entityId: string, entityTitle: string, details?: string): Promise<void> {
    await auditLogRepository.log({
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

export class LeadService extends BaseService {
  async create(data: Prisma.LeadCreateInput) {
    this.checkPermission('leads', 'create');
    const lead = await leadRepository.create({
      ...data,
      owner: data.owner ?? { connect: { id: this.context.userId } },
    });
    await this.logAudit('LEAD_CREATED', 'Lead', lead.id, `${lead.first_name} ${lead.last_name}`, `Lead created with status: ${lead.status}`);
    return lead;
  }

  async findById(id: string) {
    this.checkPermission('leads', 'read');
    const lead = await leadRepository.getLeadWithRelations(id);
    if (lead && !this.canAccessRecord(lead.owner_id)) return null;
    return lead;
  }

  async findMany(params: { where?: Prisma.LeadWhereInput; pagination?: any; sortBy?: string; sortOrder?: string }) {
    this.checkPermission('leads', 'read');
    const where = this.isAdmin()
      ? params.where
      : { ...params.where, owner_id: this.context.userId };
    return leadRepository.findMany({
      ...params,
      where,
      include: { owner: { select: { full_name: true } } },
    });
  }

  async update(id: string, data: Prisma.LeadUpdateInput) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError('NOT_FOUND', 'Lead not found', 404);
    this.checkPermission('leads', 'update', lead.owner_id === this.context.userId);
    const updated = await leadRepository.update(id, data);
    await this.logAudit('LEAD_UPDATED', 'Lead', id, `${lead.first_name} ${lead.last_name}`, 'Lead updated');
    return updated;
  }

  async delete(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError('NOT_FOUND', 'Lead not found', 404);
    this.checkPermission('leads', 'delete', lead.owner_id === this.context.userId);
    await leadRepository.delete(id);
    await this.logAudit('LEAD_DELETED', 'Lead', id, `${lead.first_name} ${lead.last_name}`, 'Lead deleted');
  }

  async convert(leadId: string, options: { createDeal: boolean; dealAmount?: number; dealTitle?: string }) {
    this.checkPermission('leads', 'update');
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw new AppError('NOT_FOUND', 'Lead not found', 404);

    return prisma.$transaction(async (tx) => {
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
    return leadRepository.getStats();
  }
}

export class ContactService extends BaseService {
  async create(data: any) {
    this.checkPermission('contacts', 'create');
    const { company_id, ...rest } = data as Record<string, unknown>;
    return contactRepository.create({
      ...(rest as Prisma.ContactCreateInput),
      ...(company_id ? { company: { connect: { id: company_id as string } } } : {}),
      owner: (rest as Prisma.ContactCreateInput).owner ?? { connect: { id: this.context.userId } },
    });
  }

  async findById(id: string) {
    this.checkPermission('contacts', 'read');
    const contact = await contactRepository.getContactWithRelations(id);
    if (contact && !this.canAccessRecord(contact.owner_id)) return null;
    return contact;
  }

  async findMany(params: { where?: Prisma.ContactWhereInput; pagination?: any }) {
    this.checkPermission('contacts', 'read');
    const where = this.isAdmin()
      ? params.where
      : { ...params.where, owner_id: this.context.userId };
    return contactRepository.findMany({
      ...params,
      where,
      include: {
        company: { select: { name: true } },
        owner: { select: { full_name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const contact = await contactRepository.findById(id);
    if (!contact) throw new AppError('NOT_FOUND', 'Contact not found', 404);
    this.checkPermission('contacts', 'update', contact.owner_id === this.context.userId);
    const { company_id, ...rest } = data as Record<string, unknown>;
    const mapped: Prisma.ContactUpdateInput = {
      ...(rest as Prisma.ContactUpdateInput),
      ...(company_id !== undefined
        ? company_id
          ? { company: { connect: { id: company_id as string } } }
          : { company: { disconnect: true } }
        : {}),
    };
    return contactRepository.update(id, mapped);
  }

  async delete(id: string) {
    const contact = await contactRepository.findById(id);
    if (!contact) throw new AppError('NOT_FOUND', 'Contact not found', 404);
    this.checkPermission('contacts', 'delete', contact.owner_id === this.context.userId);
    return contactRepository.delete(id);
  }
}

export class CompanyService extends BaseService {
  async create(data: Prisma.CompanyCreateInput) {
    this.checkPermission('companies', 'create');
    return companyRepository.create({
      ...data,
      organization: data.organization ?? { connect: { id: this.context.organizationId } },
      owner: data.owner ?? { connect: { id: this.context.userId } },
    });
  }

  async findById(id: string) {
    this.checkPermission('companies', 'read');
    const company = await companyRepository.getCompanyWithRelations(id);
    if (company && !this.canAccessRecord(company.owner_id)) return null;
    return company;
  }

  async findMany(params: { where?: Prisma.CompanyWhereInput; pagination?: any }) {
    this.checkPermission('companies', 'read');
    const where = this.isAdmin()
      ? params.where
      : { ...params.where, owner_id: this.context.userId };
    return companyRepository.findMany({
      ...params,
      where,
      include: { owner: { select: { full_name: true } } },
    });
  }

  async update(id: string, data: Prisma.CompanyUpdateInput) {
    const company = await companyRepository.findById(id);
    if (!company) throw new AppError('NOT_FOUND', 'Company not found', 404);
    this.checkPermission('companies', 'update', company.owner_id === this.context.userId);
    return companyRepository.update(id, data);
  }

  async delete(id: string) {
    const company = await companyRepository.findById(id);
    if (!company) throw new AppError('NOT_FOUND', 'Company not found', 404);
    this.checkPermission('companies', 'delete', company.owner_id === this.context.userId);
    return companyRepository.delete(id);
  }

  async getStats() {
    this.checkPermission('companies', 'read');
    return companyRepository.getStats();
  }
}

export class DealService extends BaseService {
  async create(data: any) {
    this.checkPermission('deals', 'create');
    const { company_id, contact_id, ...rest } = data as Record<string, unknown>;
    const deal = await dealRepository.create({
      ...(rest as Prisma.DealCreateInput),
      ...(company_id ? { company: { connect: { id: company_id as string } } } : {}),
      ...(contact_id ? { contact: { connect: { id: contact_id as string } } } : {}),
      owner: (rest as Prisma.DealCreateInput).owner ?? { connect: { id: this.context.userId } },
    });
    await this.logAudit('DEAL_CREATED', 'Deal', deal.id, deal.title, `Deal created in stage: ${deal.stage}`);
    return deal;
  }

  async findById(id: string) {
    this.checkPermission('deals', 'read');
    const deal = await dealRepository.getDealWithRelations(id);
    if (deal && !this.canAccessRecord(deal.owner_id)) return null;
    return deal;
  }

  async findMany(params: { where?: Prisma.DealWhereInput; pagination?: any }) {
    this.checkPermission('deals', 'read');
    const where = this.isAdmin()
      ? params.where
      : { ...params.where, owner_id: this.context.userId };
    return dealRepository.findMany({
      ...params,
      where,
      include: {
        company: { select: { name: true } },
        contact: { select: { first_name: true, last_name: true } },
        owner: { select: { full_name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const deal = await dealRepository.findById(id);
    if (!deal) throw new AppError('NOT_FOUND', 'Deal not found', 404);
    this.checkPermission('deals', 'update', deal.owner_id === this.context.userId);
    const { company_id, contact_id, ...rest } = data as Record<string, unknown>;
    const mapped: Prisma.DealUpdateInput = {
      ...(rest as Prisma.DealUpdateInput),
      ...(company_id !== undefined
        ? company_id
          ? { company: { connect: { id: company_id as string } } }
          : { company: { disconnect: true } }
        : {}),
      ...(contact_id !== undefined
        ? contact_id
          ? { contact: { connect: { id: contact_id as string } } }
          : { contact: { disconnect: true } }
        : {}),
    };
    return dealRepository.update(id, mapped);
  }

  async delete(id: string) {
    const deal = await dealRepository.findById(id);
    if (!deal) throw new AppError('NOT_FOUND', 'Deal not found', 404);
    this.checkPermission('deals', 'delete', deal.owner_id === this.context.userId);
    return dealRepository.delete(id);
  }

  async moveStage(dealId: string, newStage: string) {
    const deal = await dealRepository.findById(dealId);
    if (!deal) throw new AppError('NOT_FOUND', 'Deal not found', 404);
    this.checkPermission('deals', 'update', deal.owner_id === this.context.userId);

    const updated = await dealRepository.moveStage(dealId, newStage);
    await this.logAudit('DEAL_STAGE_CHANGED', 'Deal', dealId, deal.title, `Moved from ${deal.stage.toUpperCase()} to ${newStage.toUpperCase()}`);

    if (newStage === 'won') {
      await notificationRepository.create({
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
    return dealRepository.getPipelineStats();
  }
}

export class TaskService extends BaseService {
  async create(data: any) {
    this.checkPermission('tasks', 'create');
    const { assigned_to_id, project_id, ...rest } = data as Record<string, unknown>;
    if (assigned_to_id) {
      const assignee = await prisma.employee.findUnique({ where: { id: assigned_to_id as string } });
      if (!assignee || assignee.organization_id !== this.context.organizationId) {
        throw new AppError('INVALID_ASSIGNEE', 'Assignee not found in organization', 400);
      }
      if (!this.isAdmin() && assigned_to_id !== this.context.userId) {
        const assigner = await prisma.employee.findUnique({ where: { id: this.context.userId } });
        const sameTeam = assigner?.team_id && assignee.team_id && assigner.team_id === assignee.team_id;
        const sameDept = assigner?.department_id && assignee.department_id && assigner.department_id === assignee.department_id;
        if (!sameTeam && !sameDept) {
          throw new AppError('FORBIDDEN', 'Not allowed to assign task outside your team', 403);
        }
      }
    }
    if (project_id) {
      const project = await prisma.project.findUnique({ where: { id: project_id as string } });
      if (!project || project.organization_id !== this.context.organizationId) {
        throw new AppError('INVALID_PROJECT', 'Project not found in organization', 400);
      }
    }
    return taskRepository.create({
      ...(rest as Prisma.TaskCreateInput),
      ...(assigned_to_id ? { assigned_to: { connect: { id: assigned_to_id as string } } } : {}),
      ...(project_id ? { project: { connect: { id: project_id as string } } } : {}),
      created_by: { connect: { id: this.context.userId } },
    });
  }

  async findById(id: string) {
    this.checkPermission('tasks', 'read');
    const task = await taskRepository.getTaskWithRelations(id);
    if (task && !this.isAdmin() && task.assigned_to_id !== this.context.userId && task.created_by_id !== this.context.userId) {
      return null;
    }
    return task;
  }

  async findMany(params: { where?: Prisma.TaskWhereInput; pagination?: any }) {
    this.checkPermission('tasks', 'read');
    let where = params.where;
    if (!this.isAdmin()) {
      const ownClause: Prisma.TaskWhereInput = {
        OR: [{ assigned_to_id: this.context.userId }, { created_by_id: this.context.userId }],
      };
      where = params.where?.AND ? ({ AND: [ ...(params.where.AND as Prisma.TaskWhereInput[]), ownClause ] }) : (params.where ? { AND: [params.where as Prisma.TaskWhereInput, ownClause] } : ownClause);
    }
    return taskRepository.findMany({
      ...params,
      where,
      include: {
        assigned_to: { select: { full_name: true } },
        created_by: { select: { full_name: true } },
      },
    });
  }

  async update(id: string, data: any) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('NOT_FOUND', 'Task not found', 404);
    this.checkPermission('tasks', 'update', task.assigned_to_id === this.context.userId || task.created_by_id === this.context.userId);
    const { assigned_to_id, project_id, ...rest } = data as Record<string, unknown>;
    if (assigned_to_id) {
      const assignee = await prisma.employee.findUnique({ where: { id: assigned_to_id as string } });
      if (!assignee || assignee.organization_id !== this.context.organizationId) {
        throw new AppError('INVALID_ASSIGNEE', 'Assignee not found in organization', 400);
      }
      if (!this.isAdmin() && assigned_to_id !== this.context.userId) {
        const assigner = await prisma.employee.findUnique({ where: { id: this.context.userId } });
        const sameTeam = assigner?.team_id && assignee.team_id && assigner.team_id === assignee.team_id;
        const sameDept = assigner?.department_id && assignee.department_id && assigner.department_id === assignee.department_id;
        if (!sameTeam && !sameDept) {
          throw new AppError('FORBIDDEN', 'Not allowed to assign task outside your team', 403);
        }
      }
    }
    if (project_id) {
      const project = await prisma.project.findUnique({ where: { id: project_id as string } });
      if (!project || project.organization_id !== this.context.organizationId) {
        throw new AppError('INVALID_PROJECT', 'Project not found in organization', 400);
      }
    }
    const mapped: Prisma.TaskUpdateInput = {
      ...(rest as Prisma.TaskUpdateInput),
      ...(assigned_to_id !== undefined
        ? assigned_to_id
          ? { assigned_to: { connect: { id: assigned_to_id as string } } }
          : { assigned_to: { disconnect: true } }
        : {}),
      ...(project_id !== undefined
        ? project_id
          ? { project: { connect: { id: project_id as string } } }
          : { project: { disconnect: true } }
        : {}),
    };
    return taskRepository.update(id, mapped);
  }

  async delete(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('NOT_FOUND', 'Task not found', 404);
    this.checkPermission('tasks', 'delete', task.created_by_id === this.context.userId);
    return taskRepository.delete(id);
  }

  async toggleCompletion(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new AppError('NOT_FOUND', 'Task not found', 404);
    this.checkPermission('tasks', 'update', task.assigned_to_id === this.context.userId || task.created_by_id === this.context.userId);
    return taskRepository.toggleCompletion(id);
  }
}

export class ProjectService extends BaseService {
  async create(data: Prisma.ProjectCreateInput) {
    this.checkPermission('projects', 'create');
    return projectRepository.create(data);
  }

  async findById(id: string) {
    this.checkPermission('projects', 'read');
    return projectRepository.getProjectWithRelations(id);
  }

  async findMany(params: { where?: Prisma.ProjectWhereInput; pagination?: any }) {
    this.checkPermission('projects', 'read');
    return projectRepository.findMany(params);
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError('NOT_FOUND', 'Project not found', 404);
    this.checkPermission('projects', 'update', project.project_manager_id === this.context.userId);
    return projectRepository.update(id, data);
  }

  async delete(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new AppError('NOT_FOUND', 'Project not found', 404);
    this.checkPermission('projects', 'delete', project.project_manager_id === this.context.userId);
    return projectRepository.delete(id);
  }
}

export class EmployeeService extends BaseService {
  async create(data: Prisma.EmployeeCreateInput) {
    this.checkPermission('employees', 'create');
    return employeeRepository.create(data);
  }

  async findById(id: string) {
    this.checkPermission('employees', 'read');
    return employeeRepository.getEmployeeWithRelations(id);
  }

  async findMany(params: { where?: Prisma.EmployeeWhereInput; pagination?: any }) {
    this.checkPermission('employees', 'read');
    return employeeRepository.findMany(params);
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    this.checkPermission('employees', 'update');
    return employeeRepository.update(id, data);
  }

  async delete(id: string) {
    this.checkPermission('employees', 'delete');
    return employeeRepository.delete(id);
  }

  async search(query: string, pagination: any) {
    this.checkPermission('employees', 'read');
    return employeeRepository.search(query, pagination);
  }
}

export class AttendanceService extends BaseService {
  async checkIn(data: { date?: string; ipAddress?: string; location?: string; notes?: string }) {
    this.checkPermission('attendance', 'create');
    const date = data.date || new Date().toISOString().split('T')[0];
    const existing = await attendanceRepository.findByEmployeeAndDate(this.context.employeeId, date);
    if (existing) throw new AppError('ALREADY_CHECKED_IN', 'Already checked in today', 409);

    return attendanceRepository.create({
      employee: { connect: { id: this.context.userId } },
      date,
      check_in: new Date(),
      status: 'Present',
      ip_address: data.ipAddress,
      location: data.location,
      notes: data.notes,
    });
  }

  async checkOut(data: { ipAddress?: string; notes?: string }) {
    this.checkPermission('attendance', 'update');
    const date = new Date().toISOString().split('T')[0];
    const attendance = await attendanceRepository.findByEmployeeAndDate(this.context.employeeId, date);
    if (!attendance) throw new AppError('NOT_CHECKED_IN', 'Not checked in today', 404);
    if (attendance.check_out) throw new AppError('ALREADY_CHECKED_OUT', 'Already checked out', 409);

    const checkOutTime = new Date();
    const checkInTime = new Date(attendance.check_in);
    const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    return attendanceRepository.update(attendance.id, {
      check_out: checkOutTime,
      working_hours: Math.round(hours * 100) / 100,
      ip_address: data.ipAddress,
      notes: data.notes,
    });
  }

  async findMany(params: { where?: Prisma.AttendanceWhereInput; pagination?: any }) {
    this.checkPermission('attendance', 'read');
    return attendanceRepository.findMany(params);
  }

  async getToday() {
    this.checkPermission('attendance', 'read');
    return attendanceRepository.getTodayAttendance();
  }
}

export class LeaveService extends BaseService {
  async create(data: Prisma.LeaveRequestCreateInput) {
    this.checkPermission('leaves', 'create');
    const days = Math.ceil((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return leaveRepository.create({ ...data, employee: { connect: { id: this.context.userId } }, total_days: days });
  }

  async findById(id: string) {
    this.checkPermission('leaves', 'read');
    return leaveRepository.getLeaveWithRelations(id);
  }

  async findMany(params: { where?: Prisma.LeaveRequestWhereInput; pagination?: any }) {
    this.checkPermission('leaves', 'read');
    return leaveRepository.findMany(params);
  }

  async approve(id: string, comments?: string) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new AppError('NOT_FOUND', 'Leave request not found', 404);
    this.checkPermission('leaves', 'update');

    return leaveRepository.update(id, {
      status: 'Approved',
      approved_by: { connect: { id: this.context.userId } },
      decision_date: new Date(),
      comments,
    });
  }

  async reject(id: string, comments?: string) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new AppError('NOT_FOUND', 'Leave request not found', 404);
    this.checkPermission('leaves', 'update');

    return leaveRepository.update(id, {
      status: 'Rejected',
      approved_by: { connect: { id: this.context.userId } },
      decision_date: new Date(),
      comments,
    });
  }
}

export class DocumentService extends BaseService {
  async create(data: Prisma.DocumentCreateInput) {
    this.checkPermission('documents', 'create');
    return documentRepository.create({ ...data, uploaded_by: { connect: { id: this.context.userId } } });
  }

  async findById(id: string) {
    this.checkPermission('documents', 'read');
    return documentRepository.getDocumentWithRelations(id);
  }

  async findMany(params: { where?: Prisma.DocumentWhereInput; pagination?: any }) {
    this.checkPermission('documents', 'read');
    return documentRepository.findMany(params);
  }

  async update(id: string, data: Prisma.DocumentUpdateInput) {
    const doc = await documentRepository.findById(id);
    if (!doc) throw new AppError('NOT_FOUND', 'Document not found', 404);
    this.checkPermission('documents', 'update', doc.uploaded_by_id === this.context.userId);
    return documentRepository.update(id, data);
  }

  async delete(id: string) {
    const doc = await documentRepository.findById(id);
    if (!doc) throw new AppError('NOT_FOUND', 'Document not found', 404);
    this.checkPermission('documents', 'delete', doc.uploaded_by_id === this.context.userId);
    return documentRepository.delete(id);
  }
}

export class ActivityService extends BaseService {
  async create(data: Prisma.ActivityCreateInput) {
    this.checkPermission('activities', 'create');
    return activityRepository.create({ ...data, user_id: this.context.userId, user_name: this.context.userName });
  }

  async findByEntity(entityType: string, entityId: string, pagination: any) {
    this.checkPermission('activities', 'read');
    return activityRepository.findByEntity(entityType, entityId, pagination);
  }

  async findMany(params: { where?: Prisma.ActivityWhereInput; pagination?: any }) {
    this.checkPermission('activities', 'read');
    return activityRepository.findMany(params);
  }

  async getRecent(limit = 20) {
    this.checkPermission('activities', 'read');
    return activityRepository.getRecentActivity(limit);
  }
}

export class NotificationService extends BaseService {
  async findByUser(pagination: any) {
    this.checkPermission('notifications', 'read');
    return notificationRepository.findByUser(this.context.userId, pagination);
  }

  async getUnreadCount() {
    this.checkPermission('notifications', 'read');
    return notificationRepository.getUnreadCount(this.context.userId);
  }

  async markAsRead(id: string) {
    this.checkPermission('notifications', 'update');
    return notificationRepository.markAsRead(id);
  }

  async markAllAsRead() {
    this.checkPermission('notifications', 'update');
    return notificationRepository.markAllAsRead(this.context.userId);
  }
}

export class MeetingService extends BaseService {
  async create(data: Prisma.MeetingCreateInput) {
    this.checkPermission('meetings', 'create');
    return meetingRepository.create({
      ...data,
      host_id: this.context.userId,
      host_name: this.context.userName,
    });
  }

  async findById(id: string) {
    this.checkPermission('meetings', 'read');
    const meeting = await meetingRepository.findById(id);
    if (meeting && !this.isAdmin() && meeting.host_id !== this.context.userId) {
      const attendees: string[] = Array.isArray(meeting.attendees) ? (meeting.attendees as string[]) : [];
      if (!attendees.includes(this.context.userEmail)) return null;
    }
    return meeting;
  }

  async findMany(params: { where?: Prisma.MeetingWhereInput; pagination?: any }) {
    this.checkPermission('meetings', 'read');
    let where = params.where;
    if (!this.isAdmin()) {
      where = params.where ? ({ AND: [params.where as Prisma.MeetingWhereInput, { host_id: this.context.userId }] } as Prisma.MeetingWhereInput) : ({ host_id: this.context.userId } as Prisma.MeetingWhereInput);
    }
    return meetingRepository.findMany({ ...params, where, orderBy: { start_time: 'desc' } });
  }

  async update(id: string, data: Prisma.MeetingUpdateInput) {
    const meeting = await meetingRepository.findById(id);
    if (!meeting) throw new AppError('NOT_FOUND', 'Meeting not found', 404);
    this.checkPermission('meetings', 'update', meeting.host_id === this.context.userId);
    return meetingRepository.update(id, data);
  }

  async delete(id: string) {
    const meeting = await meetingRepository.findById(id);
    if (!meeting) throw new AppError('NOT_FOUND', 'Meeting not found', 404);
    this.checkPermission('meetings', 'delete', meeting.host_id === this.context.userId);
    return meetingRepository.delete(id);
  }
}