"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
exports.authRateLimit = authRateLimit;
exports.apiRateLimit = apiRateLimit;
const config_1 = require("../config");
const requestCounts = new Map();
function rateLimit(windowMs = config_1.config.rateLimit.windowMs, maxRequests = config_1.config.rateLimit.maxRequests) {
    return (req, res, next) => {
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
function authRateLimit() {
    return rateLimit(15 * 60 * 1000, 10);
}
function apiRateLimit() {
    return rateLimit(15 * 60 * 1000, 100);
}
//# sourceMappingURL=rateLimit.js.map