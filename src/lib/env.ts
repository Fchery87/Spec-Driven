/**
 * Environment variable validation using Zod
 * Ensures all required environment variables are set correctly at startup
 * Fails fast if configuration is invalid
 */

import { z } from 'zod';
import { logger } from './logger';

// Define validation schema for all environment variables
const envSchema = z.object({
  // Database - Required in all environments
  DATABASE_URL: z.string()
    .url('DATABASE_URL must be a valid URL')
    .refine(
      url => url.startsWith('postgres') || url.startsWith('postgresql'),
      'DATABASE_URL must be a PostgreSQL connection string'
    ),

  // Authentication - CRITICAL SECURITY
  BETTER_AUTH_SECRET: z.string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
    .optional(),
  AUTH_SECRET: z.string()
    .min(32, 'AUTH_SECRET must be at least 32 characters')
    .optional(),

  // LLM Integration - CRITICAL
  GEMINI_API_KEY: z.string()
    .min(1, 'GEMINI_API_KEY is required for LLM functionality'),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL'),

  AUTH_BASE_URL: z.string()
    .url('AUTH_BASE_URL must be a valid URL')
    .optional(),

  // CORS & Security
  ALLOWED_ORIGINS: z.string()
    .default('http://localhost:3000'),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development'),

  // Optional: Third-party integrations
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),

  // Optional: Redis for rate limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),

  // Optional: R2 Storage (Cloudflare)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),

  // Optional: AWS S3 (legacy)
  S3_BUCKET: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Optional: OAuth providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Optional: Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Optional: Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_AGGREGATION_ENABLED: z.string()
    .transform(v => v === 'true')
    .default('false'),
});

// Validate environment variables
let validatedEnv: z.infer<typeof envSchema>;

try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors
      .map(err => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n');

    const errorMessage = `
╔════════════════════════════════════════════════════════════════════════════╗
║                 ENVIRONMENT CONFIGURATION ERROR                            ║
╚════════════════════════════════════════════════════════════════════════════╝

The following environment variables are invalid or missing:

${formattedErrors}

Please fix these issues before starting the application.

For development, you can copy .env.example to .env.local:
  cp .env.example .env.local

Then update the required values in .env.local
    `.trim();

    console.error(errorMessage);
    process.exit(1);
  }
  throw error;
}

/**
 * Validated environment configuration
 * Use this instead of process.env to ensure type safety and validation
 */
export const env = validatedEnv;

/**
 * Helper to get JWT secret (tries multiple env var names)
 * CRITICAL: In production, MUST use BETTER_AUTH_SECRET or AUTH_SECRET
 */
export function getJWTSecret(): string {
  const secret = env.BETTER_AUTH_SECRET || env.AUTH_SECRET;

  if (!secret) {
    const errorMessage = `
╔════════════════════════════════════════════════════════════════════════════╗
║                  MISSING JWT SECRET ERROR                                  ║
╚════════════════════════════════════════════════════════════════════════════╝

JWT_SECRET is required for authentication.

Set one of these environment variables:
  - BETTER_AUTH_SECRET (preferred)
  - AUTH_SECRET (fallback)

Generate a new secret with:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Production deployments must have this configured before startup.
    `.trim();

    console.error(errorMessage);
    process.exit(1);
  }

  return secret;
}

// Log environment configuration on startup (production only)
if (env.NODE_ENV === 'production') {
  logger.info('Environment configuration validated', {
    nodeEnv: env.NODE_ENV,
    databaseConfigured: !!env.DATABASE_URL,
    geminiApiKeyConfigured: !!env.GEMINI_API_KEY,
    sentryConfigured: !!env.SENTRY_DSN,
    redisConfigured: !!env.UPSTASH_REDIS_REST_URL,
    r2Configured: !!(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID),
  });
}
