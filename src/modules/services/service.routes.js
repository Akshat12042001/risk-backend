import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { serviceDetailController } from './service.controller.js';
import { serviceIdSchema } from './service.validation.js';

const router = Router();

router.get('/:serviceId', validate(serviceIdSchema), serviceDetailController);

export default router;
