import { z } from 'zod';

export const serviceIdSchema = z.object({
  params: z.object({
    serviceId: z.string().regex(/^[a-f\d]{24}$/i, 'Service not found'),
  }),
});
