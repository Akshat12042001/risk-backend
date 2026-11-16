import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { listSlotsController } from './slot.controller.js';
import { listSlotsSchema } from './slot.validation.js';

const router = Router();

router.get('/', validate(listSlotsSchema), listSlotsController);

export default router;
