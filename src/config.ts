import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Configuration schema with Zod validation
const configSchema = z.object({
  PORT: z.string().transform(Number).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SOLANA_RPC_URL: z.string().url().default('https://api.mainnet-beta.solana.com'),
  PRIVATE_KEY: z.string().optional(), // Base58 encoded or JSON array string
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Parse and validate environment variables
const env = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

let config: z.infer<typeof configSchema>;

try {
  config = configSchema.parse(env);
} catch (error) {
  console.error('❌ Configuration validation failed:', error);
  process.exit(1);
}

// Export validated configuration
export { config };

// Helper function to parse private key
export function parsePrivateKey(privateKeyString?: string): number[] | null {
  if (!privateKeyString) {
    return null;
  }

  try {
    // Try parsing as JSON array first
    const parsed = JSON.parse(privateKeyString);
    if (Array.isArray(parsed) && parsed.every(n => typeof n === 'number')) {
      return parsed;
    }
  } catch {
    // If JSON parsing fails, assume it's base58 encoded
    // We'll handle base58 decoding in the service layer
  }

  return null;
}

// Export types
export type Config = typeof config;