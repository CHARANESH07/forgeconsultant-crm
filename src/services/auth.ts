import bcrypt from 'bcryptjs';
import { config } from '@/config';
import { prisma } from '@/utils/prisma';
import { employeeRepository } from '@/repositories/employee';
import { auditLogRepository } from '@/repositories/auditLog';
import { generateTokens, verifyRefreshToken, JWTPayload } from '@/middleware/auth';
import { AppError } from '@/middleware/errorHandler';
import { Prisma } from '@prisma/client';

export interface LoginResult {
  user: JWTPayload;
  tokens: { accessToken: string; refreshToken: string };
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const employee = await employeeRepository.findByEmail(email.toLowerCase());
    if (!employee) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    if (employee.employment_status !== 'Active') {
      throw new AppError('ACCOUNT_INACTIVE', 'Account is not active', 403);
    }

    const isValid = await bcrypt.compare(password, employee.password_hash);
    if (!isValid) {
      await this.logFailedLogin(email);
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const payload: JWTPayload = {
      userId: employee.id,
      email: employee.email,
      full_name: employee.full_name,
      role: employee.crm_role as any,
      organizationId: employee.organization_id,
      employeeId: employee.employee_id,
      crmRole: employee.crm_role,
      isSuperior: employee.is_superior,
    };

    const tokens = generateTokens(payload);

    await this.storeRefreshToken(employee.id, tokens.refreshToken);
    await auditLogRepository.log({
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

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    employeeId: string;
    designation: string;
    department: string;
    crmRole?: string;
    underTeamLead?: string;
    responsibleFor?: string;
    joiningDate: string;
  }): Promise<LoginResult> {
    const existing = await employeeRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('EMAIL_EXISTS', 'Email already registered', 409);
    }

    const existingId = await employeeRepository.findByEmployeeId(data.employeeId);
    if (existingId) {
      throw new AppError('EMPLOYEE_ID_EXISTS', 'Employee ID already exists', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, config.bcrypt.rounds);

    const organization = await prisma.organization.findFirst({ where: { slug: 'forge-consultancy' } });
    if (!organization) {
      throw new AppError('ORG_NOT_FOUND', 'Organization not provisioned', 500);
    }

    const employee = await prisma.employee.create({
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

    const payload: JWTPayload = {
      userId: employee.id,
      email: employee.email,
      full_name: employee.full_name,
      role: employee.crm_role as any,
      organizationId: employee.organization_id,
      employeeId: employee.employee_id,
      crmRole: employee.crm_role,
      isSuperior: employee.is_superior,
    };

    const tokens = generateTokens(payload);
    await this.storeRefreshToken(employee.id, tokens.refreshToken);

    await auditLogRepository.log({
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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError('INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token', 401);
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expires_at < new Date()) {
      throw new AppError('INVALID_REFRESH_TOKEN', 'Refresh token not found or expired', 401);
    }

    const employee = await employeeRepository.findById(decoded.userId);
    if (!employee || employee.employment_status !== 'Active') {
      throw new AppError('ACCOUNT_INACTIVE', 'Account not found or inactive', 401);
    }

    const payload: JWTPayload = {
      userId: employee.id,
      email: employee.email,
      full_name: employee.full_name,
      role: employee.crm_role as any,
      organizationId: employee.organization_id,
      employeeId: employee.employee_id,
      crmRole: employee.crm_role,
      isSuperior: employee.is_superior,
    };

    const tokens = generateTokens(payload);
    await this.rotateRefreshToken(refreshToken, tokens.refreshToken, employee.id);

    return tokens;
  }

  async logout(refreshToken: string, userId: string, organizationId?: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    const employee = await employeeRepository.findById(userId);
    await auditLogRepository.log({
      organizationId: organizationId || employee?.organization_id,
      action: 'LOGOUT',
      entityType: 'Employee',
      entityId: userId,
      entityTitle: employee?.full_name || 'User',
      userName: employee?.full_name || 'User',
      details: 'User logged out',
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const employee = await employeeRepository.findByEmail(email.toLowerCase());
    if (!employee) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: { employee_id: employee.id, token: resetToken, expires_at: expiresAt },
    });

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    await auditLogRepository.log({
      organizationId: employee.organization_id,
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'Employee',
      entityId: employee.id,
      entityTitle: employee.full_name,
      userName: employee.full_name,
      details: 'Password reset requested',
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });
    if (!resetRecord || resetRecord.expires_at < new Date()) {
      throw new AppError('INVALID_RESET_TOKEN', 'Invalid or expired reset token', 400);
    }

    if (resetRecord.used) {
      throw new AppError('TOKEN_ALREADY_USED', 'Reset token already used', 400);
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);

    await prisma.$transaction([
      prisma.employee.update({ where: { id: resetRecord.employee_id }, data: { password_hash: passwordHash } }),
      prisma.passwordReset.update({ where: { id: resetRecord.id }, data: { used: true } }),
      prisma.refreshToken.deleteMany({ where: { employee_id: resetRecord.employee_id } }),
    ]);

    const employee = await employeeRepository.findById(resetRecord.employee_id);
    await auditLogRepository.log({
      organizationId: employee!.organization_id,
      action: 'PASSWORD_RESET',
      entityType: 'Employee',
      entityId: employee!.id,
      entityTitle: employee!.full_name,
      userName: employee!.full_name,
      details: 'Password reset completed',
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const employee = await employeeRepository.findById(userId);
    if (!employee) {
      throw new AppError('NOT_FOUND', 'Employee not found', 404);
    }

    const isValid = await bcrypt.compare(currentPassword, employee.password_hash);
    if (!isValid) {
      throw new AppError('INVALID_PASSWORD', 'Current password is incorrect', 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.rounds);

    await prisma.$transaction([
      prisma.employee.update({ where: { id: userId }, data: { password_hash: passwordHash } }),
      prisma.refreshToken.deleteMany({ where: { employee_id: userId } }),
    ]);

    await auditLogRepository.log({
      organizationId: employee.organization_id,
      action: 'PASSWORD_CHANGED',
      entityType: 'Employee',
      entityId: employee.id,
      entityTitle: employee.full_name,
      userName: employee.full_name,
      details: 'Password changed by user',
    });
  }

  private async storeRefreshToken(employeeId: string, token: string): Promise<void> {
    await prisma.refreshToken.create({
      data: { employee_id: employeeId, token, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
  }

  private async rotateRefreshToken(oldToken: string, newToken: string, employeeId: string): Promise<void> {
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token: oldToken } }),
      prisma.refreshToken.create({
        data: {
          employee_id: employeeId,
          token: newToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);
  }

  private async logFailedLogin(email: string): Promise<void> {
    // Track failed attempts for rate limiting
    await prisma.loginAttempt.create({
      data: { email, success: false, attempted_at: new Date() },
    });
  }

  private async getDepartmentId(departmentName: string): Promise<string | null> {
    const dept = await prisma.department.findFirst({ where: { name: departmentName } });
    return dept?.id || null;
  }
}

export const authService = new AuthService();