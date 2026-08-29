import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodObject } from 'zod';
import { AppError } from './errorHandler';

type Section = 'body' | 'query' | 'params';

function unwrapSection(schema: ZodSchema, section: Section): ZodSchema {
  const shape = (schema as unknown as ZodObject<any>).shape;
  if (shape && typeof shape === 'object' && section in shape) {
    return shape[section] as ZodSchema;
  }
  return schema;
}

export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(new AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await unwrapSection(schema, 'body').parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(new AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await unwrapSection(schema, 'query').parseAsync(req.query);
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(new AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await unwrapSection(schema, 'params').parseAsync(req.params);
      Object.assign(req.params, parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(new AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
    }
  };
}