import { Request, Response, NextFunction } from 'express';
export declare function rateLimit(windowMs?: number, maxRequests?: number): (req: Request, res: Response, next: NextFunction) => void;
export declare function authRateLimit(): (req: Request, res: Response, next: NextFunction) => void;
export declare function apiRateLimit(): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimit.d.ts.map