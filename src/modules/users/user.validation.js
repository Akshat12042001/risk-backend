import { z } from 'zod';

const optionalText = (max, message) => z.string().trim().max(max, message).optional();

export const updateProfileSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(50, 'First name is too long')
        .optional(),
      lastName: optionalText(50, 'Last name is too long'),
      email: z
        .string()
        .trim()
        .max(120, 'Enter a valid email')
        .refine((value) => value === '' || z.string().email().safeParse(value).success, {
          message: 'Enter a valid email',
        })
        .optional(),
      referralCode: optionalText(12, 'Enter a valid referral code'),
    })
    .strict(),
});
