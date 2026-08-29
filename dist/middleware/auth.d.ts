import { Response, NextFunction } from 'express';
import { JWTPayload, AuthenticatedRequest } from '../types';
export declare function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export declare function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export declare function requireRole(...allowedRoles: JWTPayload['role'][]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare function requireCRMRole(...allowedRoles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare function generateTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>): {
    accessToken: string;
    refreshToken: string;
};
export declare function verifyRefreshToken(token: string): JWTPayload | null;
export type { JWTPayload, AuthenticatedRequest } from '../types';
//# sourceMappingURL=auth.d.ts.map