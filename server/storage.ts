import { pools, tokens, apiLogs, type Pool, type Token, type ApiLog, type InsertPool, type InsertToken, type InsertApiLog } from "../shared/schema";

export interface IStorage {
  // Pool operations
  getPool(poolId: string): Promise<Pool | undefined>;
  getAllPools(): Promise<Pool[]>;
  createPool(pool: InsertPool): Promise<Pool>;
  updatePool(poolId: string, updates: Partial<InsertPool>): Promise<Pool | undefined>;

  // Token operations
  getToken(mint: string): Promise<Token | undefined>;
  getAllTokens(): Promise<Token[]>;
  createToken(token: InsertToken): Promise<Token>;
  updateToken(mint: string, updates: Partial<InsertToken>): Promise<Token | undefined>;

  // API logging
  logApiRequest(log: InsertApiLog): Promise<ApiLog>;
  getApiLogs(limit?: number): Promise<ApiLog[]>;
  getApiMetrics(): Promise<{
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  }>;
}

export class MemStorage implements IStorage {
  private pools: Map<string, Pool>;
  private tokens: Map<string, Token>;
  private apiLogs: ApiLog[];
  private poolIdCounter: number;
  private tokenIdCounter: number;
  private logIdCounter: number;

  constructor() {
    this.pools = new Map();
    this.tokens = new Map();
    this.apiLogs = [];
    this.poolIdCounter = 1;
    this.tokenIdCounter = 1;
    this.logIdCounter = 1;
  }

  async getPool(poolId: string): Promise<Pool | undefined> {
    return this.pools.get(poolId);
  }

  async getAllPools(): Promise<Pool[]> {
    return Array.from(this.pools.values());
  }

  async createPool(insertPool: InsertPool): Promise<Pool> {
    const id = this.poolIdCounter++;
    const now = new Date();
    const pool: Pool = {
      ...insertPool,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.pools.set(insertPool.poolId, pool);
    return pool;
  }

  async updatePool(poolId: string, updates: Partial<InsertPool>): Promise<Pool | undefined> {
    const existingPool = this.pools.get(poolId);
    if (!existingPool) return undefined;

    const updatedPool: Pool = {
      ...existingPool,
      ...updates,
      updatedAt: new Date(),
    };
    this.pools.set(poolId, updatedPool);
    return updatedPool;
  }

  async getToken(mint: string): Promise<Token | undefined> {
    return this.tokens.get(mint);
  }

  async getAllTokens(): Promise<Token[]> {
    return Array.from(this.tokens.values());
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = this.tokenIdCounter++;
    const now = new Date();
    const token: Token = {
      ...insertToken,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.tokens.set(insertToken.mint, token);
    return token;
  }

  async updateToken(mint: string, updates: Partial<InsertToken>): Promise<Token | undefined> {
    const existingToken = this.tokens.get(mint);
    if (!existingToken) return undefined;

    const updatedToken: Token = {
      ...existingToken,
      ...updates,
      updatedAt: new Date(),
    };
    this.tokens.set(mint, updatedToken);
    return updatedToken;
  }

  async logApiRequest(insertLog: InsertApiLog): Promise<ApiLog> {
    const id = this.logIdCounter++;
    const log: ApiLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
    };
    this.apiLogs.push(log);
    
    // Keep only last 10000 logs to prevent memory issues
    if (this.apiLogs.length > 10000) {
      this.apiLogs = this.apiLogs.slice(-10000);
    }
    
    return log;
  }

  async getApiLogs(limit: number = 100): Promise<ApiLog[]> {
    return this.apiLogs.slice(-limit).reverse();
  }

  async getApiMetrics(): Promise<{
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  }> {
    const totalRequests = this.apiLogs.length;
    const averageResponseTime = totalRequests > 0 
      ? this.apiLogs.reduce((sum, log) => sum + log.responseTime, 0) / totalRequests 
      : 0;
    const errorRequests = this.apiLogs.filter(log => log.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
    const uptime = Math.max(0, 100 - errorRate); // Simplified uptime calculation

    return {
      totalRequests,
      averageResponseTime,
      errorRate,
      uptime,
    };
  }
}

export const storage = new MemStorage();
