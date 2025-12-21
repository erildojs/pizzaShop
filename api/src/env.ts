import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(3333),
    API_BASE_URL: z.string().url(),
    AUTH_REDIRECT_URL: z.string().url(),
    DATABASE_URL: z.string().url().min(1),
    JWT_SECRET_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().optional(), // Make optional if not strictly required for dev start
})

export const env = envSchema.parse(process.env)
