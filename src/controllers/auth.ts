import { Response } from 'express';
import { authService, LoginResult } from '@/services/auth';
import { config } from '@/config';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/auth';

function setAuthCookies(res: Response, tokens: LoginResult['tokens']): void {
  const isProd = config.nodeEnv === 'production';
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res: Response): void {
  const isProd = config.nodeEnv === 'production';
  res.clearCookie('accessToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
}

function getAuthContext(req: AuthenticatedRequest): { userId: string; email: string; fullName?: string; crmRole?: string } {
  const user = req.user!;
  return {
    userId: user.userId,
    email: user.email,
    fullName: user.full_name,
    crmRole: user.crmRole,
  };
}

export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  setAuthCookies(res, result.tokens);
  res.json({
    success: true,
    data: { user: result.user },
  });
});

export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, fullName, employeeId, designation, department, crmRole, underTeamLead, responsibleFor, joiningDate } = req.body;
  const result = await authService.register({ email, password, fullName, employeeId, designation, department, crmRole, underTeamLead, responsibleFor, joiningDate });
  setAuthCookies(res, result.tokens);
  res.status(201).json({ success: true, data: { user: result.user } });
});

export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
  const tokens = await authService.refreshToken(refreshToken);
  setAuthCookies(res, tokens);
  res.json({ success: true, data: { accessToken: tokens.accessToken } });
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (refreshToken && req.user) {
    await authService.logout(refreshToken, req.user.userId, req.user.organizationId);
  }
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const forgotPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
});

export const resetPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.json({ success: true, message: 'Password reset successful' });
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user!.userId, currentPassword, newPassword);
  clearAuthCookies(res);
  res.json({ success: true, message: 'Password changed. Please log in again.' });
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: { user: req.user } });
});