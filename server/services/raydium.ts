import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import BN from 'bn.js';
import { z } from 'zod';

// Input validation schemas
const swapQuoteSchema = z.object({
  inputMint: z.string().min(32, 'Invalid input mint address'),
  outputMint: z.string().min(32, 'Invalid output mint address'),
  amountIn: z.string().or(z.number()).transform(val => new BN(val.toString())),
  slippagePct: z.number().min(0).max(100).default(0.5)
});

const transferTokenSchema = z.object({
  mint: z.string().min(32, 'Invalid mint address'),
  toPublicKey: z.string().min(32, 'Invalid recipient address'),
  amount: z.string().or(z.number()).transform(val => new BN(val.toString()))
});

// Types
export interface SwapQuoteResult {
  amountOut: BN;
  minimumAmountOut: BN;
  fee: BN;
  priceImpact: number;
  route: string[];
}

export interface SwapTransactionResult {
  transaction: Transaction;
  signers?: Keypair[];
}

export interface RaydiumService {
  connection: Connection;
  raydium: Raydium;
}

// Global service instance
let raydiumService: RaydiumService | null = null;

/**
 * Initialize Raydium SDK with connection and configuration
 */
export async function initRaydium(): Promise<RaydiumService> {
  try {
    // Use environment variable or default to public RPC
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    // TODO: Replace with actual wallet public key for production use
    // For internal service, you might want to use a dedicated service wallet
    const placeholderWallet = Keypair.generate();
    
    console.log('Initializing Raydium SDK...');
    
    const raydium = await Raydium.load({
      connection,
      owner: placeholderWallet.publicKey,
      signAllTransactions: async (transactions: Transaction[]) => {
        // TODO: Implement proper transaction signing logic
        // This should integrate with your wallet adapter or keypair management
        console.warn('Transaction signing not implemented - placeholder function');
        return transactions;
      },
      // Additional configuration options
      cluster: 'mainnet-beta',
      // TODO: Add any specific pool or token configurations needed
    });

    raydiumService = { connection, raydium };
    console.log('✅ Raydium SDK initialized successfully');
    
    return raydiumService;
  } catch (error) {
    console.error('❌ Failed to initialize Raydium SDK:', error);
    throw new Error(`Raydium initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get or initialize Raydium service instance
 */
async function getRaydiumService(): Promise<RaydiumService> {
  if (!raydiumService) {
    raydiumService = await initRaydium();
  }
  return raydiumService;
}

/**
 * Get swap quote using Raydium SDK
 */
export async function quoteSwap(
  inputMint: string,
  outputMint: string,
  amountIn: string | number,
  slippagePct: number = 0.5
): Promise<SwapQuoteResult> {
  try {
    // Validate inputs
    const validated = swapQuoteSchema.parse({
      inputMint,
      outputMint,
      amountIn,
      slippagePct
    });

    const { raydium } = await getRaydiumService();
    
    // Convert string addresses to PublicKey objects
    const inputMintPubkey = new PublicKey(validated.inputMint);
    const outputMintPubkey = new PublicKey(validated.outputMint);

    console.log(`Getting swap quote: ${validated.amountIn.toString()} ${inputMint} -> ${outputMint}`);

    // Use Raydium SDK to get swap quote with proper error handling
    let quoteResult;
    try {
      // Try different API methods based on Raydium SDK v2 structure
      if (raydium.api && raydium.api.getSwapQuote) {
        quoteResult = await raydium.api.getSwapQuote({
          inputMint: inputMintPubkey,
          outputMint: outputMintPubkey,
          amount: validated.amountIn,
          slippageBps: Math.floor(validated.slippagePct * 100),
        });
      } else if (raydium.quote && raydium.quote.swap) {
        quoteResult = await raydium.quote.swap({
          inputMint: inputMintPubkey,
          outputMint: outputMintPubkey,
          amount: validated.amountIn,
          slippage: validated.slippagePct,
        });
      } else {
        throw new Error('Raydium SDK quote method not available');
      }
    } catch (sdkError) {
      console.error('Raydium SDK error:', sdkError);
      throw new Error(`Raydium SDK error: ${sdkError instanceof Error ? sdkError.message : 'Unknown error'}`);
    }

    if (!quoteResult || (!quoteResult.outAmount && !quoteResult.amountOut)) {
      throw new Error('Failed to get swap quote from Raydium - no output amount returned');
    }

    // Extract output amount from quote result
    const outAmount = quoteResult.outAmount || quoteResult.amountOut;
    
    // Calculate minimum amount out with slippage
    const slippageMultiplier = (100 - validated.slippagePct) / 100;
    const minimumAmountOut = new BN(outAmount.toString()).mul(new BN(Math.floor(slippageMultiplier * 10000))).div(new BN(10000));

    return {
      amountOut: new BN(quoteResult.outAmount.toString()),
      minimumAmountOut,
      fee: new BN(quoteResult.fee?.toString() || '0'),
      priceImpact: quoteResult.priceImpact || 0,
      route: quoteResult.routePlan?.map(step => step.ammKey.toString()) || []
    };

  } catch (error) {
    console.error('Error getting swap quote:', error);
    throw new Error(`Swap quote failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build swap transaction using Raydium SDK
 */
export async function buildSwapTransaction(
  inputMint: string,
  outputMint: string,
  amountIn: string | number,
  slippagePct: number = 0.5,
  ownerPubkey: string
): Promise<SwapTransactionResult> {
  try {
    // Validate inputs
    const validated = swapQuoteSchema.parse({
      inputMint,
      outputMint,
      amountIn,
      slippagePct
    });

    const { raydium } = await getRaydiumService();
    const ownerPublicKey = new PublicKey(ownerPubkey);
    
    console.log(`Building swap transaction for ${ownerPubkey}`);

    // Get quote first
    const quote = await quoteSwap(inputMint, outputMint, amountIn, slippagePct);

    // Build the swap transaction
    const swapTransaction = await raydium.swap.create({
      inputMint: new PublicKey(validated.inputMint),
      outputMint: new PublicKey(validated.outputMint),
      amountIn: validated.amountIn,
      amountOut: quote.minimumAmountOut,
      owner: ownerPublicKey,
      // TODO: Add any additional swap parameters needed
    });

    if (!swapTransaction || !swapTransaction.transaction) {
      throw new Error('Failed to build swap transaction');
    }

    return {
      transaction: swapTransaction.transaction,
      signers: swapTransaction.signers || []
    };

  } catch (error) {
    console.error('Error building swap transaction:', error);
    throw new Error(`Build swap transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Execute complete swap operation
 */
export async function executeSwap(
  inputMint: string,
  outputMint: string,
  amountIn: string | number,
  slippagePct: number = 0.5,
  ownerKeypair: Keypair
): Promise<string> {
  try {
    const { connection } = await getRaydiumService();
    
    console.log(`Executing swap for ${ownerKeypair.publicKey.toString()}`);

    // Build the transaction
    const { transaction, signers } = await buildSwapTransaction(
      inputMint,
      outputMint,
      amountIn,
      slippagePct,
      ownerKeypair.publicKey.toString()
    );

    // Add all required signers
    const allSigners = [ownerKeypair, ...(signers || [])];

    // TODO: Add proper fee estimation and priority fee handling
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = ownerKeypair.publicKey;

    // Sign and send transaction
    console.log('Signing and sending swap transaction...');
    const txid = await sendAndConfirmTransaction(
      connection,
      transaction,
      allSigners,
      {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      }
    );

    console.log(`✅ Swap executed successfully: ${txid}`);
    return txid;

  } catch (error) {
    console.error('Error executing swap:', error);
    throw new Error(`Swap execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Transfer SPL tokens between accounts
 */
export async function transferToken(
  mint: string,
  fromKeypair: Keypair,
  toPublicKey: string,
  amount: string | number
): Promise<string> {
  try {
    // Validate inputs
    const validated = transferTokenSchema.parse({
      mint,
      toPublicKey,
      amount
    });

    const { connection } = await getRaydiumService();
    const mintPubkey = new PublicKey(validated.mint);
    const toPubkey = new PublicKey(validated.toPublicKey);

    console.log(`Transferring ${validated.amount.toString()} tokens from ${fromKeypair.publicKey.toString()} to ${toPublicKey}`);

    // Get or create associated token accounts
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      mintPubkey,
      fromKeypair.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair, // Payer
      mintPubkey,
      toPubkey
    );

    // Execute the transfer
    const txid = await transfer(
      connection,
      fromKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromKeypair,
      validated.amount.toNumber(),
      [],
      {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
      }
    );

    console.log(`✅ Token transfer successful: ${txid}`);
    return txid;

  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw new Error(`Token transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Utility function to create a keypair from private key
 * TODO: Implement secure key management for production
 */
export function createKeypairFromPrivateKey(privateKeyArray: number[]): Keypair {
  try {
    return Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
  } catch (error) {
    throw new Error(`Invalid private key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Utility function to validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// Export types for external use
export type { Keypair, PublicKey, Connection, Transaction };

/*
// Example Usage:

// 1. Initialize the service
await initRaydium();

// 2. Get a swap quote
const quote = await quoteSwap(
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  '1000000000', // 1 SOL (in lamports)
  0.5 // 0.5% slippage
);
console.log('Quote:', quote);

// 3. Execute a swap (requires actual keypair)
const ownerKeypair = Keypair.generate(); // TODO: Use real keypair
const swapTxid = await executeSwap(
  'So11111111111111111111111111111111111111112',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '1000000000',
  0.5,
  ownerKeypair
);

// 4. Transfer tokens
const transferTxid = await transferToken(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  ownerKeypair,
  'TargetPublicKeyHere...',
  '1000000' // 1 USDC (6 decimals)
);

// 5. Validate addresses
console.log('Valid address?', isValidSolanaAddress('So11111111111111111111111111111111111111112'));
*/