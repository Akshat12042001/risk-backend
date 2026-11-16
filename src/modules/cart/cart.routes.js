import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartBookingController,
  updateCartItemController,
} from './cart.controller.js';
import {
  addCartItemSchema,
  cartItemIdSchema,
  updateCartBookingSchema,
  updateCartItemSchema,
} from './cart.validation.js';

const router = Router();

router.use(requireAuth);
router.get('/', getCartController);
router.post('/items', validate(addCartItemSchema), addCartItemController);
router.patch('/items/:itemId', validate(updateCartItemSchema), updateCartItemController);
router.delete('/items/:itemId', validate(cartItemIdSchema), removeCartItemController);
router.patch('/booking', validate(updateCartBookingSchema), updateCartBookingController);

export default router;
