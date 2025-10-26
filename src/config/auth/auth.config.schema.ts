import * as  z from "zod";

export const authConfigSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});