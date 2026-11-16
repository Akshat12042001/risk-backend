import { z } from 'zod';

export const listSlotsSchema = z.object({
  query: z
    .object({
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')
        .optional(),
      period: z.enum(['morning', 'afternoon', 'evening']).optional(),
    })
    .strict(),
});
