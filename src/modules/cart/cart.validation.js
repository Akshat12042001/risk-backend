import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const addCartItemSchema = z.object({
  body: z
    .object({
      serviceId: objectId,
      durationId: z.string().trim().min(1, 'Duration is required'),
    })
    .strict(),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: objectId,
  }),
  body: z
    .object({
      durationId: z.string().trim().min(1, 'Duration is required'),
    })
    .strict(),
});

export const cartItemIdSchema = z.object({
  params: z.object({
    itemId: objectId,
  }),
});

export const updateCartBookingSchema = z.object({
  body: z
    .object({
      slotDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')
        .optional(),
      slotId: objectId.optional(),
      addressId: objectId.optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, { message: 'Nothing to update' }),
});
