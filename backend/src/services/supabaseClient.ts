import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'SUPABASE_PUBLISHABLE_KEY is required'),
});

const env = envSchema.parse(process.env);

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_PUBLISHABLE_KEY
);
