import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { swapQuoteSchema, tokenAccountParseSchema } from "@shared/schema";
import cors from "cors";

// Mock Raydium SDK integration (in real implementation, use actual SDK)
class RaydiumService {
  async getPoolData() {
    // Simulate getting pool data from Raydium SDK
    return [
      {
        poolId: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
        baseTokenMint: "So11111111111111111111111111111111111111112",
        quoteTokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        lpTokenMint: "8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh",
        baseTokenReserve: "1000000000000",
        quoteTokenReserve: "50000000000",
        tvl: 1250000,
        volume24h: 2500000,
        apy: 15.5,
      },
      {
        poolId: "7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX",
        baseTokenMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
        quoteTokenMint: "So11111111111111111111111111111111111111112",
        lpTokenMint: "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm",
        baseTokenReserve: "750000000000",
        quoteTokenReserve: "800000000000",
        tvl: 975000,
        volume24h: 1800000,
        apy: 12.3,
      },
    ];
  }

  async getTokenData() {
    return [
      {
        mint: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        name: "Solana",
        decimals: 9,
        logoUri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        price: 95.25,
        marketCap: 45000000000,
        volume24h: 850000000,
      },
      {
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        symbol: "USDC",
        name: "USD Coin",
        decimals: 6,
        logoUri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        price: 1.0,
        marketCap: 28000000000,
        volume24h: 2100000000,
      },
    ];
  }

  async calculateSwapQuote(inputMint: string, outputMint: string, amount: string, slippage: number) {
    // Simulate swap quote calculation
    const inputAmount = parseInt(amount);
    const mockRate = inputMint === "So11111111111111111111111111111111111111112" ? 95.25 : 1 / 95.25;
    const outputAmount = Math.floor(inputAmount * mockRate * (1 - slippage / 100));
    const priceImpact = slippage * 0.1; // Simplified price impact
    
    return {
      inputMint,
      outputMint,
      inputAmount: amount,
      outputAmount: outputAmount.toString(),
      priceImpact,
      slippage,
      route: [inputMint, outputMint],
      minOutputAmount: Math.floor(outputAmount * (1 - slippage / 100)).toString(),
    };
  }

  async parseTokenAccount(accountData: string, owner: string) {
    // Simulate token account parsing
    return {
      mint: "So11111111111111111111111111111111111111112",
      owner,
      amount: "1000000000",
      decimals: 9,
      uiAmount: 1.0,
      uiAmountString: "1.0",
    };
  }
}

const raydiumService = new RaydiumService();

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for all routes
  app.use(cors({
    origin: true,
    credentials: true,
  }));

  // Request logging middleware
  app.use("/api", async (req, res, next) => {
    const start = Date.now();
    
    res.on("finish", async () => {
      const responseTime = Date.now() - start;
      await storage.logApiRequest({
        endpoint: req.path,
        method: req.method,
        responseTime,
        statusCode: res.statusCode,
      });
    });
    
    next();
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const metrics = await storage.getApiMetrics();
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        metrics,
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get all pools
  app.get("/api/pools", async (req, res) => {
    try {
      // Initialize with mock data if empty
      const existingPools = await storage.getAllPools();
      if (existingPools.length === 0) {
        const mockPools = await raydiumService.getPoolData();
        for (const pool of mockPools) {
          await storage.createPool(pool);
        }
      }
      
      const pools = await storage.getAllPools();
      res.json({
        pools,
        count: pools.length,
        updated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch pools",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get specific pool
  app.get("/api/pools/:poolId", async (req, res) => {
    try {
      const { poolId } = req.params;
      const pool = await storage.getPool(poolId);
      
      if (!pool) {
        return res.status(404).json({
          error: "Pool not found",
          poolId,
        });
      }
      
      res.json(pool);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch pool",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get all tokens
  app.get("/api/tokens", async (req, res) => {
    try {
      // Initialize with mock data if empty
      const existingTokens = await storage.getAllTokens();
      if (existingTokens.length === 0) {
        const mockTokens = await raydiumService.getTokenData();
        for (const token of mockTokens) {
          await storage.createToken(token);
        }
      }
      
      const tokens = await storage.getAllTokens();
      res.json({
        tokens,
        count: tokens.length,
        updated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch tokens",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get specific token
  app.get("/api/tokens/:mint", async (req, res) => {
    try {
      const { mint } = req.params;
      let token = await storage.getToken(mint);
      
      if (!token) {
        // Try to fetch from mock data
        const mockTokens = await raydiumService.getTokenData();
        const mockToken = mockTokens.find(t => t.mint === mint);
        if (mockToken) {
          token = await storage.createToken(mockToken);
        }
      }
      
      if (!token) {
        return res.status(404).json({
          error: "Token not found",
          mint,
        });
      }
      
      res.json(token);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch token",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Calculate swap quote
  app.post("/api/swap/quote", async (req, res) => {
    try {
      const validatedData = swapQuoteSchema.parse(req.body);
      const quote = await raydiumService.calculateSwapQuote(
        validatedData.inputMint,
        validatedData.outputMint,
        validatedData.amount,
        validatedData.slippage
      );
      
      res.json(quote);
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues,
        });
      }
      
      res.status(500).json({
        error: "Failed to calculate swap quote",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Parse token account data
  app.post("/api/token-account/parse", async (req, res) => {
    try {
      const validatedData = tokenAccountParseSchema.parse(req.body);
      const parsed = await raydiumService.parseTokenAccount(
        validatedData.accountData,
        validatedData.owner
      );
      
      res.json(parsed);
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues,
        });
      }
      
      res.status(500).json({
        error: "Failed to parse token account",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get API metrics and status
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getApiMetrics();
      const recentLogs = await storage.getApiLogs(50);
      
      res.json({
        ...metrics,
        recentRequests: recentLogs,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch metrics",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get API documentation/routes
  app.get("/api/docs", (req, res) => {
    res.json({
      title: "FiLotMicroservice - Precision Investing API",
      description: "Professional-grade DeFi tools for precision investing",
      version: "1.0.0",
      endpoints: [
        {
          path: "/api/health",
          method: "GET",
          description: "Check API health status",
        },
        {
          path: "/api/pools",
          method: "GET",
          description: "Get all liquidity pools",
        },
        {
          path: "/api/pools/:poolId",
          method: "GET",
          description: "Get specific pool information",
        },
        {
          path: "/api/tokens",
          method: "GET",
          description: "Get all tokens",
        },
        {
          path: "/api/tokens/:mint",
          method: "GET",
          description: "Get specific token information",
        },
        {
          path: "/api/swap/quote",
          method: "POST",
          description: "Calculate swap quote",
          body: {
            inputMint: "string",
            outputMint: "string",
            amount: "string",
            slippage: "number (optional, default: 0.5)",
          },
        },
        {
          path: "/api/token-account/parse",
          method: "POST",
          description: "Parse token account data",
          body: {
            accountData: "string",
            owner: "string",
          },
        },
        {
          path: "/api/metrics",
          method: "GET",
          description: "Get API metrics and performance data",
        },
      ],
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
