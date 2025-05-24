import { PublicKey, Transaction, Keypair } from '@solana/web3.js';
import BN from 'bn.js';

// Quote result interface
export interface QuoteResult {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  minimumAmountOut: string;
  priceImpact: number;
  fee: string;
  route: string[];
  slippage: number;
}

// Swap transaction result
export interface SwapTransactionResult {
  transaction: Transaction;
  signers: Keypair[];
  quote: QuoteResult;
}

// Transfer result
export interface TransferResult {
  signature: string;
  explorerUrl: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  mint: string;
}

// API Response wrappers
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SwapQuoteResponse extends ApiResponse<QuoteResult> {}

export interface SwapExecuteResponse extends ApiResponse<{
  signature: string;
  explorerUrl: string;
  quote: QuoteResult;
}> {}

export interface TransferResponse extends ApiResponse<TransferResult> {}

// Request schemas
export interface QuoteSwapRequest {
  inMint: string;
  outMint: string;
  amount: string;
  slippagePct?: number;
}

export interface BuildSwapRequest {
  inMint: string;
  outMint: string;
  amount: string;
  slippagePct?: number;
  ownerPubkey: string;
}

export interface ExecuteSwapRequest {
  inMint: string;
  outMint: string;
  amount: string;
  slippagePct?: number;
}

export interface TransferTokenRequest {
  mint: string;
  toPubkey: string;
  amount: string;
}

// Error types
export class RaydiumServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'RaydiumServiceError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TransactionError extends Error {
  constructor(message: string, public txSignature?: string) {
    super(message);
    this.name = 'TransactionError';
  }
}