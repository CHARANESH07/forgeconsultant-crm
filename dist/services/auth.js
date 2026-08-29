"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const prisma_1 = require("../utils/prisma");
const employee_1 = require("../repositories/employee");
const auditLog_1 = require("../repositories/auditLog");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthService {
    async login(email, password) {
        const employee = await employee_1.employeeRepository.findByEmail(email.toLowerCase());
        if (!employee) {
            throw new errorHandler_1.AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
        }
        if (employee.employment_status !== 'Active') {
            throw new errorHandler_1.AppError('ACCOUNT_INACTIVE', 'Account is not active', 403);
        }
        const isValid = await bcryptjs_1.default.compare(password, employee.password_hash);
        if (!isValid) {
            await this.logFailedLogin(email);
            throw new errorHandler_1.AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
        }
        const payload = {
            userId: employee.id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.crm_role,
            organizationId: employee.organization_id,
            employeeId: employee.employee_id,
            crmRole: employee.crm_role,
            isSuperior: employee.is_superior,
        };
        const tokens = (0, auth_1.generateTokens)(payload);
        await this.storeRefreshToken(employee.id, tokens.refreshToken);
        await auditLog_1.auditLogRepository.log({
            organizationId: employee.organization_id,
            action: 'LOGIN',
            entityType: 'Employee',
            entityId: employee.id,
            entityTitle: employee.full_name,
            userName: employee.full_name,
            details: 'Successful login',
        });
        return { user: payload, tokens };
    }
    async register(data) {
        const existing = await employee_1.employeeRepository.findByEmail(data.email);
        if (existing) {
            throw new errorHandler_1.AppError('EMAIL_EXISTS', 'Email already registered', 409);
        }
        const existingId = await employee_1.employeeRepository.findByEmployeeId(data.employeeId);
        if (existingId) {
            throw new errorHandler_1.AppError('EMPLOYEE_ID_EXISTS', 'Employee ID already exists', 409);
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, config_1.config.bcrypt.rounds);
        const organization = await prisma_1.prisma.organization.findFirst({ where: { slug: 'forge-consultancy' } });
        if (!organization) {
            throw new errorHandler_1.AppError('ORG_NOT_FOUND', 'Organization not provisioned', 500);
        }
        const employee = await prisma_1.prisma.employee.create({
            data: {
                organization_id: organization.id,
                department_id: await this.getDepartmentId(data.department),
                employee_id: data.employeeId,
                full_name: data.fullName,
                email: data.email.toLowerCase(),
                designation: data.designation || 'Consultant',
                crm_role: 'employee',
                under_team_lead: data.underTeamLead,
                responsible_for: data.responsibleFor,
                joining_date: data.joiningDate || new Date().toISOString().split('T')[0],
                employment_status: 'Active',
                is_superior: false,
                password_hash: passwordHash,
            },
        });
        const payload = {
            userId: employee.id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.crm_role,
            organizationId: employee.organization_id,
            employeeId: employee.employee_id,
            crmRole: employee.crm_role,
            isSuperior: employee.is_superior,
        };
        const tokens = (0, auth_1.generateTokens)(payload);
        await this.storeRefreshToken(employee.id, tokens.refreshToken);
        await auditLog_1.auditLogRepository.log({
            organizationId: employee.organization_id,
            action: 'EMPLOYEE_CREATED',
            entityType: 'Employee',
            entityId: employee.id,
            entityTitle: employee.full_name,
            userName: employee.full_name,
            details: 'New employee registered',
        });
        return { user: payload, tokens };
    }
    async refreshToken(refreshToken) {
        const decoded = (0, auth_1.verifyRefreshToken)(refreshToken);
        if (!decoded) {
            throw new errorHandler_1.AppError('INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token', 401);
        }
        const stored = await prisma_1.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!stored || stored.expires_at < new Date()) {
            throw new errorHandler_1.AppError('INVALID_REFRESH_TOKEN', 'Refresh token not found or expired', 401);
        }
        const employee = await employee_1.employeeRepository.findById(decoded.userId);
        if (!employee || employee.employment_status !== 'Active') {
            throw new errorHandler_1.AppError('ACCOUNT_INACTIVE', 'Account not found or inactive', 401);
        }
        const payload = {
            userId: employee.id,
            email: employee.email,
            full_name: employee.full_name,
            role: employee.crm_role,
            organizationId: employee.organization_id,
            employeeId: employee.employee_id,
            crmRole: employee.crm_role,
            isSuperior: employee.is_superior,
        };
        const tokens = (0, auth_1.generateTokens)(payload);
        await this.rotateRefreshToken(refreshToken, tokens.refreshToken, employee.id);
        return tokens;
    }
    async logout(refreshToken, userId, organizationId) {
        await prisma_1.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        const employee = await employee_1.employeeRepository.findById(userId);
        await auditLog_1.auditLogRepository.log({
            organizationId: organizationId || employee?.organization_id,
            action: 'LOGOUT',
            entityType: 'Employee',
            entityId: userId,
            entityTitle: employee?.full_name || 'User',
            userName: employee?.full_name || 'User',
            details: 'User logged out',
        });
    }
    async forgotPassword(email) {
        const employee = await employee_1.employeeRepository.findByEmail(email.toLowerCase());
        if (!employee) {
            // Don't reveal if email exists
            return;
        }
        const resetToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await prisma_1.prisma.passwordReset.create({
            data: { employee_id: employee.id, token: resetToken, expires_at: expiresAt },
        });
        // TODO: Send email with reset link
        console.log(`Password reset token for ${email}: ${resetToken}`);
        await auditLog_1.auditLogRepository.log({
            organizationId: employee.organization_id,
            action: 'PASSWORD_RESET_REQUESTED',
            entityType: 'Employee',
            entityId: employee.id,
            entityTitle: employee.full_name,
            userName: employee.full_name,
            details: 'Password reset requested',
        });
    }
    async resetPassword(token, password) {
        const resetRecord = await prisma_1.prisma.passwordReset.findUnique({ where: { token } });
        if (!resetRecord || resetRecord.expires_at < new Date()) {
            throw new errorHandler_1.AppError('INVALID_RESET_TOKEN', 'Invalid or expired reset token', 400);
        }
        if (resetRecord.used) {
            throw new errorHandler_1.AppError('TOKEN_ALREADY_USED', 'Reset token already used', 400);
        }
        const passwordHash = await bcryptjs_1.default.hash(password, config_1.config.bcrypt.rounds);
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.employee.update({ where: { id: resetRecord.employee_id }, data: { password_hash: passwordHash } }),
            prisma_1.prisma.passwordReset.update({ where: { id: resetRecord.id }, data: { used: true } }),
            prisma_1.prisma.refreshToken.deleteMany({ where: { employee_id: resetRecord.employee_id } }),
        ]);
        const employee = await employee_1.employeeRepository.findById(resetRecord.employee_id);
        await auditLog_1.auditLogRepository.log({
            organizationId: employee.organization_id,
            action: 'PASSWORD_RESET',
            entityType: 'Employee',
            entityId: employee.id,
            entityTitle: employee.full_name,
            userName: employee.full_name,
            details: 'Password reset completed',
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const employee = await employee_1.employeeRepository.findById(userId);
        if (!employee) {
            throw new errorHandler_1.AppError('NOT_FOUND', 'Employee not found', 404);
        }
        const isValid = await bcryptjs_1.default.compare(currentPassword, employee.password_hash);
        if (!isValid) {
            throw new errorHandler_1.AppError('INVALID_PASSWORD', 'Current password is incorrect', 401);
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, config_1.config.bcrypt.rounds);
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.employee.update({ where: { id: userId }, data: { password_hash: passwordHash } }),
            prisma_1.prisma.refreshToken.deleteMany({ where: { employee_id: userId } }),
        ]);
        await auditLog_1.auditLogRepository.log({
            organizationId: employee.organization_id,
            action: 'PASSWORD_CHANGED',
            entityType: 'Employee',
            entityId: employee.id,
            entityTitle: employee.full_name,
            userName: employee.full_name,
            details: 'Password changed by user',
        });
    }
    async storeRefreshToken(employeeId, token) {
        await prisma_1.prisma.refreshToken.create({
            data: { employee_id: employeeId, token, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });
    }
    async rotateRefreshToken(oldToken, newToken, employeeId) {
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.refreshToken.delete({ where: { token: oldToken } }),
            prisma_1.prisma.refreshToken.create({
                data: {
                    employee_id: employeeId,
                    token: newToken,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            }),
        ]);
    }
    async logFailedLogin(email) {
        // Track failed attempts for rate limiting
        await prisma_1.prisma.loginAttempt.create({
            data: { email, success: false, attempted_at: new Date() },
        });
    }
    async getDepartmentId(departmentName) {
        const dept = await prisma_1.prisma.department.findFirst({ where: { name: departmentName } });
        return dept?.id || null;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.js.map