import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { updateProfileController } from './user.controller.js';
import { updateProfileSchema } from './user.validation.js';

const router = Router();

router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfileController);

export default router;
