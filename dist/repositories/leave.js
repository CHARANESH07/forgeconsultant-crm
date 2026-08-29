"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRepository = exports.LeaveRepository = void 0;
const base_1 = require("./base");
class LeaveRepository extends base_1.AbstractRepository {
    modelName = 'leaveRequest';
    async findByEmployee(employeeId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { employee_id: employeeId }, pagination, orderBy: { created_at: 'desc' } });
    }
    async findPendingForApprover(approverId, pagination = { page: 1, limit: 20 }) {
        return this.findMany({
            where: { status: 'Pending', approved_by_id: approverId },
            pagination,
            orderBy: { created_at: 'desc' },
        });
    }
    async findPendingAll(pagination = { page: 1, limit: 20 }) {
        return this.findMany({ where: { status: 'Pending' }, pagination, orderBy: { created_at: 'desc' } });
    }
    async getLeaveWithRelations(id) {
        return this.model.findUnique({
            where: { id },
            include: { employee: true, approved_by: true },
        });
    }
}
exports.LeaveRepository = LeaveRepository;
exports.leaveRepository = new LeaveRepository();
//# sourceMappingURL=leave.js.map