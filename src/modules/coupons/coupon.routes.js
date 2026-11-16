import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  applyCouponController,
  listCouponsController,
  removeCouponController,
} from './coupon.controller.js';
import { applyCouponSchema } from './coupon.validation.js';

const router = Router();

router.get('/', listCouponsController);
router.post('/apply', requireAuth, validate(applyCouponSchema), applyCouponController);
router.delete('/apply', requireAuth, removeCouponController);

export default router;
