import { Router } from 'express';
import addressRoutes from '../modules/addresses/address.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import healthRoutes from '../modules/health/health.routes.js';
import homeRoutes from '../modules/home/home.routes.js';
import serviceRoutes from '../modules/services/service.routes.js';
import userRoutes from '../modules/users/user.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/addresses', addressRoutes);
router.use('/home', homeRoutes);
router.use('/services', serviceRoutes);

export default router;
