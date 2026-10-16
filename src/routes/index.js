import { Router } from 'express';
import addressRoutes from '../modules/addresses/address.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import healthRoutes from '../modules/health/health.routes.js';
import userRoutes from '../modules/users/user.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/addresses', addressRoutes);

export default router;
