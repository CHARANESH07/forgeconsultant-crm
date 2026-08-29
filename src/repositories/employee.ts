import { AbstractRepository } from './base';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '@/types';

export class EmployeeRepository extends AbstractRepository<
  any,
  Prisma.EmployeeCreateInput,
  Prisma.EmployeeUpdateInput,
  Prisma.EmployeeWhereInput
> {
  protected modelName = 'employee';

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email } });
  }

  async findByEmployeeId(employeeId: string) {
    return this.model.findUnique({ where: { employee_id: employeeId } });
  }

  async findByDepartment(department: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { department: { name: department } }, pagination });
  }

  async findByTeam(teamId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({ where: { team_id: teamId }, pagination });
  }

  async findSuperiors() {
    return this.model.findMany({ where: { is_superior: true } });
  }

  async findSubordinates(superiorId: string) {
    return this.model.findMany({ where: { under_team_lead: superiorId } });
  }

  async findByCrmRole(crmRole: string) {
    return this.model.findMany({ where: { crm_role: crmRole } });
  }

  async getEmployeeWithRelations(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        department: true,
        team: true,
        attendance: { take: 30, orderBy: { date: 'desc' } },
        leaveRequests: { take: 10, orderBy: { created_at: 'desc' } },
        dailyWorkLogs: { take: 10, orderBy: { date: 'desc' } },
        ownedCompanies: true,
        ownedLeads: true,
        ownedDeals: true,
        managedProjects: true,
        assignedTasks: { take: 10 },
      },
    });
  }

  async search(query: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
    return this.findMany({
      where: {
        OR: [
          { full_name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { employee_id: { contains: query, mode: 'insensitive' } },
          { designation: { contains: query, mode: 'insensitive' } },
          { under_team_lead: { contains: query, mode: 'insensitive' } },
        ],
      },
      pagination,
    });
  }
}

export const employeeRepository = new EmployeeRepository();