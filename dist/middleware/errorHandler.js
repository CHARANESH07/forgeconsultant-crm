"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const types_1 = require("../types");
class AppError extends Error {
    code;
    message;
    statusCode;
    details;
    constructor(code, message, statusCode = 500, details) {
        super(message);
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, req, res, _next) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);
    if (err instanceof zod_1.z.ZodError) {
        const response = (0, types_1.errorResponse)('VALIDATION_ERROR', 'Invalid request data', err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        })));
        res.status(400).json(response);
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const target = err.meta?.target?.join(', ') || 'field';
            const response = (0, types_1.errorResponse)('DUPLICATE_ENTRY', `${target} already exists`);
            res.status(409).json(response);
            return;
        }
        if (err.code === 'P2025') {
            const response = (0, types_1.errorResponse)('NOT_FOUND', 'Record not found');
            res.status(404).json(response);
            return;
        }
        if (err.code === 'P2003') {
            const response = (0, types_1.errorResponse)('FOREIGN_KEY_CONSTRAINT', 'Referenced record does not exist');
            res.status(400).json(response);
            return;
        }
    }
    if (err instanceof AppError) {
        const response = (0, types_1.errorResponse)(err.code, err.message, err.details);
        res.status(err.statusCode).json(response);
        return;
    }
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        const response = (0, types_1.errorResponse)('INVALID_JSON', 'Malformed JSON in request body');
        res.status(400).json(response);
        return;
    }
    const response = (0, types_1.errorResponse)('INTERNAL_ERROR', 'An unexpected error occurred');
    res.status(500).json(response);
}
function notFoundHandler(req, res) {
    const response = (0, types_1.errorResponse)('NOT_FOUND', `Route ${req.method} ${req.path} not found`);
    res.status(404).json(response);
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=errorHandler.js.map