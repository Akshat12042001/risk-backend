import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createBookingController,
  getBookingController,
  listBookingsController,
} from './booking.controller.js';
import { bookingIdSchema, listBookingsSchema } from './booking.validation.js';

const router = Router();

router.use(requireAuth);
router.post('/', createBookingController);
router.get('/', validate(listBookingsSchema), listBookingsController);
router.get('/:bookingId', validate(bookingIdSchema), getBookingController);

export default router;
