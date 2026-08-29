"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    apiPrefix: '/api/v1',
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
        accessExpiry: '15m',
        refreshExpiry: '7d',
    },
    bcrypt: {
        rounds: 12,
    },
    database: {
        url: process.env.DATABASE_URL || '',
    },
    cors: {
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
            : ['http://localhost:3000'],
        credentials: true,
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 100,
    },
    email: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.SMTP_FROM || 'noreply@forgeconsultant.in',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
//# sourceMappingURL=index.js.map