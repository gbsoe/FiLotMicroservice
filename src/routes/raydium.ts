import express from 'express';
import { z } from 'zod';
import { logger } from '../logger.js';
import { 
  quoteSwap, 
  buildSwapTx, 
  executeSwap, 
  transferToken,
  validatePublicKey 
} from '../services/raydium.js';
import { 
  ApiResponse, 
  QuoteSwapRequest, 
  BuildSwapRequest, 
  ExecuteSwapRequest, 
  TransferTokenRequest,
  ValidationError,
  RaydiumServiceError 
} from '../models.js';

const router = express.Router();

// Validation schemas using Zod
const quoteSwapSchema = z.object({
  inMint: z.string().min(32, 'Invalid input mint address'),
  outMint: z.string().min(32, 'Invalid output mint address'), 
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer'),
  slippagePct: z.number().min(0).max(100).optional().default(0.5)
});

const buildSwapSchema = z.object({
  inMint: z.string().min(32, 'Invalid input mint address'),
  outMint: z.string().min(32, 'Invalid output mint address'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer'),
  slippagePct: z.number().min(0).max(100).optional().default(0.5),
  ownerPubkey: z.string().min(32, 'Invalid owner public key')
});

const executeSwapSchema = z.object({
  inMint: z.string().min(32, 'Invalid input mint address'),
  outMint: z.string().min(32, 'Invalid output mint address'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer'),
  slippagePct: z.number().min(0).max(100).optional().default(0.5)
});

const transferTokenSchema = z.object({
  mint: z.string().min(32, 'Invalid mint address'),
  toPubkey: z.string().min(32, 'Invalid recipient public key'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a positive integer')
});

// Helper function to create API response
function createResponse<T>(success: boolean, data?: T, error?: string): ApiResponse<T> {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
}

/**
 * GET /api/raydium/quote-swap
 * Get swap quote using authentic Raydium SDK v2
 * Query params: inMint, outMint, amount, slippagePct
 */
router.get('/quote-swap', async (req, res) => {
  try {
    // Parse and validate query parameters
    const queryParams = {
      inMint: req.query.inMint as string,
      outMint: req.query.outMint as string,
      amount: req.query.amount as string,
      slippagePct: req.query.slippagePct ? parseFloat(req.query.slippagePct as string) : 0.5
    };

    const validated = quoteSwapSchema.parse(queryParams);

    logger.info(`Quote swap request: ${validated.inMint} -> ${validated.outMint}, amount: ${validated.amount}`);

    // Get quote using authentic Raydium SDK
    const quote = await quoteSwap(
      validated.inMint,
      validated.outMint, 
      validated.amount,
      validated.slippagePct
    );

    res.json(createResponse(true, quote));

  } catch (error) {
    logger.error('Quote swap error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json(createResponse(false, undefined, `Validation error: ${error.errors.map(e => e.message).join(', ')}`));
    } else if (error instanceof ValidationError) {
      res.status(400).json(createResponse(false, undefined, error.message));
    } else if (error instanceof RaydiumServiceError) {
      res.status(500).json(createResponse(false, undefined, error.message));
    } else {
      res.status(500).json(createResponse(false, undefined, 'Internal server error'));
    }
  }
});

/**
 * POST /api/raydium/build-swap
 * Build swap transaction using Raydium SDK v2
 * Body: { inMint, outMint, amount, slippagePct, ownerPubkey }
 */
router.post('/build-swap', async (req, res) => {
  try {
    const validated = buildSwapSchema.parse(req.body);

    // Validate owner public key format
    if (!validatePublicKey(validated.ownerPubkey)) {
      throw new ValidationError('Invalid owner public key format');
    }

    logger.info(`Build swap transaction for: ${validated.ownerPubkey}`);

    // Build transaction using Raydium SDK
    const result = await buildSwapTx(
      validated.inMint,
      validated.outMint,
      validated.amount,
      validated.slippagePct,
      validated.ownerPubkey
    );

    // Convert transaction to base64 for response
    const transactionBase64 = result.transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    }).toString('base64');

    const responseData = {
      transaction: transactionBase64,
      quote: result.quote,
      signers: result.signers.map(s => s.publicKey.toString())
    };

    res.json(createResponse(true, responseData));

  } catch (error) {
    logger.error('Build swap error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json(createResponse(false, undefined, `Validation error: ${error.errors.map(e => e.message).join(', ')}`));
    } else if (error instanceof ValidationError) {
      res.status(400).json(createResponse(false, undefined, error.message));
    } else if (error instanceof RaydiumServiceError) {
      res.status(500).json(createResponse(false, undefined, error.message));
    } else {
      res.status(500).json(createResponse(false, undefined, 'Internal server error'));
    }
  }
});

/**
 * POST /api/raydium/execute-swap
 * Execute swap transaction using PRIVATE_KEY from environment
 * Body: { inMint, outMint, amount, slippagePct }
 */
router.post('/execute-swap', async (req, res) => {
  try {
    const validated = executeSwapSchema.parse(req.body);

    logger.info(`Execute swap: ${validated.inMint} -> ${validated.outMint}, amount: ${validated.amount}`);

    // Execute swap using private key from environment
    const signature = await executeSwap(
      validated.inMint,
      validated.outMint,
      validated.amount,
      validated.slippagePct
    );

    const responseData = {
      signature,
      explorerUrl: `https://solscan.io/tx/${signature}`,
      network: 'mainnet-beta'
    };

    res.json(createResponse(true, responseData));

  } catch (error) {
    logger.error('Execute swap error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json(createResponse(false, undefined, `Validation error: ${error.errors.map(e => e.message).join(', ')}`));
    } else if (error instanceof ValidationError) {
      res.status(400).json(createResponse(false, undefined, error.message));
    } else if (error instanceof RaydiumServiceError) {
      res.status(500).json(createResponse(false, undefined, error.message));
    } else {
      res.status(500).json(createResponse(false, undefined, 'Internal server error'));
    }
  }
});

/**
 * POST /api/raydium/transfer-token
 * Transfer SPL tokens using PRIVATE_KEY from environment
 * Body: { mint, toPubkey, amount }
 */
router.post('/transfer-token', async (req, res) => {
  try {
    const validated = transferTokenSchema.parse(req.body);

    // Validate recipient public key
    if (!validatePublicKey(validated.toPubkey)) {
      throw new ValidationError('Invalid recipient public key format');
    }

    logger.info(`Transfer token: ${validated.amount} of ${validated.mint} to ${validated.toPubkey}`);

    // Execute token transfer
    const result = await transferToken(
      validated.mint,
      validated.toPubkey,
      validated.amount
    );

    res.json(createResponse(true, result));

  } catch (error) {
    logger.error('Transfer token error:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json(createResponse(false, undefined, `Validation error: ${error.errors.map(e => e.message).join(', ')}`));
    } else if (error instanceof ValidationError) {
      res.status(400).json(createResponse(false, undefined, error.message));
    } else if (error instanceof RaydiumServiceError) {
      res.status(500).json(createResponse(false, undefined, error.message));
    } else {
      res.status(500).json(createResponse(false, undefined, 'Internal server error'));
    }
  }
});

/**
 * GET /api/raydium/health
 * Health check endpoint for Raydium service
 */
router.get('/health', async (req, res) => {
  try {
    // TODO: Add actual Raydium SDK health check
    const healthData = {
      service: 'Raydium SDK v2',
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    res.json(createResponse(true, healthData));
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json(createResponse(false, undefined, 'Service unavailable'));
  }
});

export default router;