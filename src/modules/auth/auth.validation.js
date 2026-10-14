import { z } from 'zod';

const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .min(10, 'Enter a valid phone number')
  .max(16, 'Enter a valid phone number');

export const sendOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    otp: z
      .string({ required_error: 'OTP is required' })
      .regex(/^\d{6}$/, 'OTP must be 6 digits'),
  }),
});
