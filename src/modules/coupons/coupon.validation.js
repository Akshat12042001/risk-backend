import { z } from 'zod';

export const applyCouponSchema = z.object({
  body: z
    .object({
      code: z
        .string({ required_error: 'Type coupon code here' })
        .trim()
        .min(1, 'Type coupon code here')
        .max(32, 'Enter a valid coupon code'),
    })
    .strict(),
});
