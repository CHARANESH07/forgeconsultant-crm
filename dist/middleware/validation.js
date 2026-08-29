"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
const zod_1 = require("zod");
const errorHandler_1 = require("./errorHandler");
function unwrapSection(schema, section) {
    const shape = schema.shape;
    if (shape && typeof shape === 'object' && section in shape) {
        return shape[section];
    }
    return schema;
}
function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(error);
                return;
            }
            next(new errorHandler_1.AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
        }
    };
}
function validateBody(schema) {
    return async (req, res, next) => {
        try {
            req.body = await unwrapSection(schema, 'body').parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(error);
                return;
            }
            next(new errorHandler_1.AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
        }
    };
}
function validateQuery(schema) {
    return async (req, res, next) => {
        try {
            const parsed = await unwrapSection(schema, 'query').parseAsync(req.query);
            Object.assign(req.query, parsed);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(error);
                return;
            }
            next(new errorHandler_1.AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
        }
    };
}
function validateParams(schema) {
    return async (req, res, next) => {
        try {
            const parsed = await unwrapSection(schema, 'params').parseAsync(req.params);
            Object.assign(req.params, parsed);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(error);
                return;
            }
            next(new errorHandler_1.AppError('VALIDATION_ERROR', 'Validation failed', 400, error));
        }
    };
}
//# sourceMappingURL=validation.js.map