export declare const config: {
    nodeEnv: string;
    port: number;
    apiPrefix: string;
    jwt: {
        secret: string;
        refreshSecret: string;
        accessExpiry: string;
        refreshExpiry: string;
    };
    bcrypt: {
        rounds: number;
    };
    database: {
        url: string;
    };
    cors: {
        origin: string[];
        credentials: boolean;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    email: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    frontendUrl: string;
};
//# sourceMappingURL=index.d.ts.map