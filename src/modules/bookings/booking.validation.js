import { z } from 'zod';

export const listBookingsSchema = z.object({
  query: z
    .object({
      tab: z.enum(['upcoming', 'previous']).optional(),
    })
    .strict(),
});

export const bookingIdSchema = z.object({
  params: z.object({
    bookingId: z.string().regex(/^[a-f\d]{24}$/i, 'Booking not found'),
  }),
});

