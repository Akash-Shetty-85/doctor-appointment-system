import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  CLIENT_URL: z.string().url(),

  MONGODB_URI: z.string().min(1),

  SESSION_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
