import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@/config';
import { JWTPayload, AuthenticatedRequest, normalizeRole } from '@/types';

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
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
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
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

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = headerToken || req.cookies?.accessToken || null;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      req.user = decoded;
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
}

export function requireRole(...allowedRoles: JWTPayload['role'][]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!allowedRoles.includes(normalizeRole(req.user.role))) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
      return;
    }

    next();
  };
}

export function requireCRMRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

export function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): { accessToken: string; refreshToken: string } {
  const accessOptions: SignOptions = { expiresIn: config.jwt.accessExpiry as SignOptions['expiresIn'] };
  const refreshOptions: SignOptions = { expiresIn: config.jwt.refreshExpiry as SignOptions['expiresIn'] };
  
  const accessToken = jwt.sign(payload, config.jwt.secret, accessOptions);
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, refreshOptions);
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
  } catch {
    return null;
  }
}

export type { JWTPayload, AuthenticatedRequest } from '@/types';