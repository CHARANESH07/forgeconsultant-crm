import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from '@/config';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { apiRateLimit } from '@/middleware/rateLimit';
import prisma from '@/utils/prisma';

const app = express();

const allowedOrigins = Array.isArray(config.cors.origin)
  ? config.cors.origin
  : [config.cors.origin];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: config.cors.credentials,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiRateLimit());

app.use(config.apiPrefix, routes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`API available at http://localhost:${config.port}${config.apiPrefix}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;