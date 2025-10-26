import * as z from 'zod';

export const appConfigSchema = z.object({
  PORT: z.string().regex(/^\d+$/).default('3000'),
  FRONTEND_URL: z.url().optional(),
  BACKEND_URL: z.url().optional(),
});


