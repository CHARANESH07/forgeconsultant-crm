"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRepository = exports.EmployeeRepository = void 0;
const base_1 = require("./base");
class EmployeeRepository extends base_1.AbstractRepository {
    modelName = 'employee';
    async findByEmail(email) {
        return this.model.findUnique({ where: { email } });
    }
    async findByEmployeeId(employeeId) {
        return this.model.findUnique({ where: { employee_id: employeeId } });
    }
    async findByDepartment(department, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { department: { name: department } }, pagination });
    }
    async findByTeam(teamId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { team_id: teamId }, pagination });
    }
    async findSuperiors() {
        return this.model.findMany({ where: { is_superior: true } });
    }
    async findSubordinates(superiorId) {
        return this.model.findMany({ where: { under_team_lead: superiorId } });
    }
    async findByCrmRole(crmRole) {
        return this.model.findMany({ where: { crm_role: crmRole } });
    }
    async getEmployeeWithRelations(id) {
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
    async search(query, pagination = { page: 1, limit: 20 }) {
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
exports.EmployeeRepository = EmployeeRepository;
exports.employeeRepository = new EmployeeRepository();
//# sourceMappingURL=employee.js.map