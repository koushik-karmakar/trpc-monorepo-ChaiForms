import { z } from "zod";

const envSchema = z.object({
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().default("http://localhost:3000/callback"),
  JWT_TOKEN_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "prod"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) throw new Error(parsed.error.message);

export const env = parsed.data;
