import { Router } from 'express';
import * as authController from '@/controllers/auth';
import { authenticateToken } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import { authSchemas, authRateLimit } from '@/validators';

const router = Router();

router.post('/login', authRateLimit(), validateBody(authSchemas.login), authController.login);
router.post('/register', authRateLimit(), validateBody(authSchemas.register), authController.register);
router.post('/refresh', validateBody(authSchemas.refreshToken), authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.post('/forgot-password', authRateLimit(), validateBody(authSchemas.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validateBody(authSchemas.resetPassword), authController.resetPassword);
router.post('/change-password', authenticateToken, validateBody(authSchemas.changePassword), authController.changePassword);
router.get('/me', authenticateToken, authController.me);

export default router;