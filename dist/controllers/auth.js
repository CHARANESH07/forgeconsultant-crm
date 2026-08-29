"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.register = exports.login = void 0;
const auth_1 = require("../services/auth");
const config_1 = require("../config");
const errorHandler_1 = require("../middleware/errorHandler");
function setAuthCookies(res, tokens) {
    const isProd = config_1.config.nodeEnv === 'production';
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
function clearAuthCookies(res) {
    const isProd = config_1.config.nodeEnv === 'production';
    res.clearCookie('accessToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
}
function getAuthContext(req) {
    const user = req.user;
    return {
        userId: user.userId,
        email: user.email,
        fullName: user.full_name,
        crmRole: user.crmRole,
    };
}
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const result = await auth_1.authService.login(email, password);
    setAuthCookies(res, result.tokens);
    res.json({
        success: true,
        data: { user: result.user },
    });
});
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, fullName, employeeId, designation, department, crmRole, underTeamLead, responsibleFor, joiningDate } = req.body;
    const result = await auth_1.authService.register({ email, password, fullName, employeeId, designation, department, crmRole, underTeamLead, responsibleFor, joiningDate });
    setAuthCookies(res, result.tokens);
    res.status(201).json({ success: true, data: { user: result.user } });
});
exports.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
    const tokens = await auth_1.authService.refreshToken(refreshToken);
    setAuthCookies(res, tokens);
    res.json({ success: true, data: { accessToken: tokens.accessToken } });
});
exports.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (refreshToken && req.user) {
        await auth_1.authService.logout(refreshToken, req.user.userId, req.user.organizationId);
    }
    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    await auth_1.authService.forgotPassword(email);
    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
});
exports.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token, password } = req.body;
    await auth_1.authService.resetPassword(token, password);
    res.json({ success: true, message: 'Password reset successful' });
});
exports.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await auth_1.authService.changePassword(req.user.userId, currentPassword, newPassword);
    clearAuthCookies(res);
    res.json({ success: true, message: 'Password changed. Please log in again.' });
});
exports.me = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.json({ success: true, data: { user: req.user } });
});
//# sourceMappingURL=auth.js.map