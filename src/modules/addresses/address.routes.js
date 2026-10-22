import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createAddressController,
  deleteAddressController,
  listAddressesController,
  markCurrentAddressController,
  updateAddressController,
} from './address.controller.js';
import { addressIdSchema, createAddressSchema, updateAddressSchema } from './address.validation.js';

const router = Router();

router.use(requireAuth);
router.get('/', listAddressesController);
router.post('/', validate(createAddressSchema), createAddressController);
router.patch('/:addressId', validate(updateAddressSchema), updateAddressController);
router.post('/:addressId/select', validate(addressIdSchema), markCurrentAddressController);
router.delete('/:addressId', validate(addressIdSchema), deleteAddressController);

export default router;
