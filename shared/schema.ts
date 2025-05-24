import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Pool information schema
export const pools = pgTable("pools", {
  id: serial("id").primaryKey(),
  poolId: text("pool_id").notNull().unique(),
  baseTokenMint: text("base_token_mint").notNull(),
  quoteTokenMint: text("quote_token_mint").notNull(),
  lpTokenMint: text("lp_token_mint").notNull(),
  baseTokenReserve: text("base_token_reserve").notNull(),
  quoteTokenReserve: text("quote_token_reserve").notNull(),
  tvl: real("tvl"),
  volume24h: real("volume_24h"),
  apy: real("apy"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Token information schema
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  mint: text("mint").notNull().unique(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  decimals: integer("decimals").notNull(),
  logoUri: text("logo_uri"),
  price: real("price"),
  marketCap: real("market_cap"),
  volume24h: real("volume_24h"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API request logs
export const apiLogs = pgTable("api_logs", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  responseTime: integer("response_time").notNull(),
  statusCode: integer("status_code").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Swap quote request schema
export const swapQuoteSchema = z.object({
  inputMint: z.string().min(1, "Input token mint is required"),
  outputMint: z.string().min(1, "Output token mint is required"),
  amountIn: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? val : val.toString()),
  slippagePct: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseFloat(val) : val).optional().default(0.5),
});

// Token account parse request schema
export const tokenAccountParseSchema = z.object({
  accountData: z.string().min(1, "Account data is required"),
  owner: z.string().min(1, "Owner address is required"),
});

export const insertPoolSchema = createInsertSchema(pools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiLogSchema = createInsertSchema(apiLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertPool = z.infer<typeof insertPoolSchema>;
export type Pool = typeof pools.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertApiLog = z.infer<typeof insertApiLogSchema>;
export type ApiLog = typeof apiLogs.$inferSelect;
export type SwapQuoteRequest = z.infer<typeof swapQuoteSchema>;
export type TokenAccountParseRequest = z.infer<typeof tokenAccountParseSchema>;
