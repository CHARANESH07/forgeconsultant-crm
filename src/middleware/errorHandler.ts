import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { errorResponse, ApiResponse } from '@/types';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  if (err instanceof z.ZodError) {
    const response: ApiResponse = errorResponse(
      'VALIDATION_ERROR',
      'Invalid request data',
      err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
    );
    res.status(400).json(response);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      const response: ApiResponse = errorResponse('DUPLICATE_ENTRY', `${target} already exists`);
      res.status(409).json(response);
      return;
    }
    if (err.code === 'P2025') {
      const response: ApiResponse = errorResponse('NOT_FOUND', 'Record not found');
      res.status(404).json(response);
      return;
    }
    if (err.code === 'P2003') {
      const response: ApiResponse = errorResponse('FOREIGN_KEY_CONSTRAINT', 'Referenced record does not exist');
      res.status(400).json(response);
      return;
    }
  }

  if (err instanceof AppError) {
    const response: ApiResponse = errorResponse(err.code, err.message, err.details);
    res.status(err.statusCode).json(response);
    return;
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    const response: ApiResponse = errorResponse('INVALID_JSON', 'Malformed JSON in request body');
    res.status(400).json(response);
    return;
  }

  const response: ApiResponse = errorResponse('INTERNAL_ERROR', 'An unexpected error occurred');
  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiResponse = errorResponse('NOT_FOUND', `Route ${req.method} ${req.path} not found`);
  res.status(404).json(response);
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}