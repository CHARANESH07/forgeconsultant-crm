import { Request, Response, NextFunction } from 'express';
import { config } from '@/config';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  windowMs: number = config.rateLimit.windowMs,
  maxRequests: number = config.rateLimit.maxRequests
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (record.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
        },
      });
      return;
    }

    record.count++;
    next();
  };
}

export function authRateLimit() {
  return rateLimit(15 * 60 * 1000, 10);
}

export function apiRateLimit() {
  return rateLimit(15 * 60 * 1000, 100);
}