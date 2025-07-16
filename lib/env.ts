import { z } from "zod";

const envSchema = z.object({
  NEYNAR_API_KEY: z.string().min(1, "NEYNAR_API_KEY is required in your .env.local file"),
});

export const env = envSchema.parse(process.env);