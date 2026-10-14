import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { logoutController, meController, sendOtpController, verifyOtpController } from './auth.controller.js';
import { sendOtpSchema, verifyOtpSchema } from './auth.validation.js';

const sendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Try again later',
  },
});

const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts. Try again later',
  },
});

const router = Router();

router.post('/send-otp', sendOtpLimiter, validate(sendOtpSchema), sendOtpController);
router.post('/verify-otp', verifyOtpLimiter, validate(verifyOtpSchema), verifyOtpController);
router.post('/logout', requireAuth, logoutController);
router.get('/me', requireAuth, meController);

export default router;
