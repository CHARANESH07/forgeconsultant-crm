"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimit_1 = require("./middleware/rateLimit");
const prisma_1 = __importDefault(require("./utils/prisma"));
const app = (0, express_1.default)();
const allowedOrigins = Array.isArray(config_1.config.cors.origin)
    ? config_1.config.cors.origin
    : [config_1.config.cors.origin];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: config_1.config.cors.credentials,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, rateLimit_1.apiRateLimit)());
app.use(config_1.config.apiPrefix, routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
async function startServer() {
    try {
        await prisma_1.default.$connect();
        console.log('Database connected');
        app.listen(config_1.config.port, () => {
            console.log(`Server running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
            console.log(`API available at http://localhost:${config_1.config.port}${config_1.config.apiPrefix}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map