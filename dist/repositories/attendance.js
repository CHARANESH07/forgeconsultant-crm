"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceRepository = exports.AttendanceRepository = void 0;
const base_1 = require("./base");
class AttendanceRepository extends base_1.AbstractRepository {
    modelName = 'attendance';
    async findByEmployeeAndDate(employeeId, date) {
        return this.model.findUnique({ where: { employee_id_date: { employee_id: employeeId, date } } });
    }
    async findByEmployee(employeeId, pagination = { page: 1, limit: 30 }) {
        return this.findMany({
            where: { employee_id: employeeId },
            pagination,
            orderBy: { date: 'desc' },
        });
    }
    async findByDate(date, pagination = { page: 1, limit: 100 }) {
        return this.findMany({
            where: { date },
            pagination,
            include: { employee: { select: { full_name: true, employee_id: true, email: true } } },
        });
    }
    async getTodayAttendance() {
        const today = new Date().toISOString().split('T')[0];
        return this.model.findMany({
            where: { date: today },
            include: { employee: { select: { full_name: true, employee_id: true, email: true, department: true } } },
        });
    }
}
exports.AttendanceRepository = AttendanceRepository;
exports.attendanceRepository = new AttendanceRepository();
//# sourceMappingURL=attendance.js.map