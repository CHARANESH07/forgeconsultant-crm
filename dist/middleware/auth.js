"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.optionalAuth = optionalAuth;
exports.requireRole = requireRole;
exports.requireCRMRole = requireCRMRole;
exports.generateTokens = generateTokens;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const types_1 = require("../types");
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = headerToken || req.cookies?.accessToken || null;
    if (!token) {
        res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Access token required' },
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: { code: 'TOKEN_EXPIRED', message: 'Access token expired' },
            });
            return;
        }
        res.status(403).json({
            success: false,
            error: { code: 'INVALID_TOKEN', message: 'Invalid or malformed token' },
        });
    }
}
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = headerToken || req.cookies?.accessToken || null;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
            req.user = decoded;
        }
        catch {
            // Ignore invalid token for optional auth
        }
    }
    next();
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
            });
            return;
        }
        if (!allowedRoles.includes((0, types_1.normalizeRole)(req.user.role))) {
            res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
            });
            return;
        }
        next();
    };
}
function requireCRMRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
            });
            return;
        }
        if (!allowedRoles.includes(req.user.crmRole)) {
            res.status(403).json({
                success: false,
                error: { code: 'FORBIDDEN', message: 'Insufficient CRM permissions' },
            });
            return;
        }
        next();
    };
}
function generateTokens(payload) {
    const accessOptions = { expiresIn: config_1.config.jwt.accessExpiry };
    const refreshOptions = { expiresIn: config_1.config.jwt.refreshExpiry };
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, accessOptions);
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.refreshSecret, refreshOptions);
    return { accessToken, refreshToken };
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.config.jwt.refreshSecret);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.js.map