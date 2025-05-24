# FiLotMicroservice Client Integration Guide

**Complete Developer Documentation for Precision Investing API**

---

## Quick Start

FiLotMicroservice provides **free**, **no-authentication** access to authentic Raydium SDK v2 functionality for DeFi trading and precision investing.

**Base URL:** `https://filotmicroservice.replit.app`

**API Version:** 1.0.0

**Authentication:** None required

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Rate Limits & Usage Guidelines](#rate-limits--usage-guidelines)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Complete Endpoint Reference](#complete-endpoint-reference)
6. [Integration Examples](#integration-examples)
7. [SDK Implementations](#sdk-implementations)
8. [Testing & Validation](#testing--validation)
9. [Production Best Practices](#production-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## API Overview

### Features
- **Authentic Raydium SDK v2 Integration** - Real-time DeFi data
- **Zero Configuration** - No API keys or registration required
- **High Performance** - Average response time: 40ms
- **100% Uptime** - Reliable service with comprehensive monitoring
- **Real-time Data** - Live pools, tokens, and swap calculations
- **Multiple Formats** - JSON responses with consistent structure

### Supported Operations
- Health monitoring and API status
- Liquidity pool data retrieval
- Token information and metadata
- Swap quote calculations
- Token account parsing
- Performance metrics access

---

## Rate Limits & Usage Guidelines

### Current Limits
- **No rate limits** currently enforced
- **Fair usage policy** applies
- **Respectful crawling** recommended (1-second delay between requests)

### Recommended Usage Patterns
```bash
# Good: Sequential requests with delay
curl https://filotmicroservice.replit.app/api/health
sleep 1
curl https://filotmicroservice.replit.app/api/pools

# Avoid: Rapid burst requests
```

---

## Response Format

### Standard Response Structure
All endpoints return JSON with consistent structure:

```json
{
  "data": {...},           // Main response data
  "count": 123,           // Count for collection endpoints
  "updated": "ISO8601",   // Last update timestamp
  "status": "success"     // Operation status
}
```

### Error Response Structure
```json
{
  "error": "Error description",
  "statusCode": 400,
  "timestamp": "2025-05-24T03:57:20.123Z",
  "path": "/api/endpoint"
}
```

---

## Error Handling

### HTTP Status Codes
| Code | Meaning | Action Required |
|------|---------|----------------|
| `200` | Success | Continue processing |
| `400` | Bad Request | Check request parameters |
| `404` | Not Found | Verify resource exists |
| `500` | Server Error | Retry after delay |

### Error Handling Examples

#### JavaScript/TypeScript
```javascript
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    
    // Implement retry logic
    if (error.message.includes('500')) {
      console.log('Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return fetchWithErrorHandling(url); // Retry once
    }
    
    throw error;
  }
}
```

#### Python
```python
import requests
import time
from typing import Dict, Any

def api_request_with_retry(url: str, max_retries: int = 3) -> Dict[Any, Any]:
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 500 and attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"Server error, retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                continue
            raise
            
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
    
    raise Exception("Max retries exceeded")
```

---

## Complete Endpoint Reference

### 1. Health Check
Monitor API status and connection to Raydium SDK.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-05-24T03:57:20.123Z",
  "version": "1.0.0",
  "raydium": "connected",
  "metrics": {
    "totalRequests": 1250,
    "averageResponseTime": 42.3,
    "errorRate": 0.0,
    "uptime": 100
  }
}
```

**Integration Example:**
```javascript
// Health check with monitoring
async function checkApiHealth() {
  const health = await fetch('https://filotmicroservice.replit.app/api/health')
    .then(res => res.json());
  
  console.log(`API Status: ${health.status}`);
  console.log(`Raydium Connection: ${health.raydium}`);
  console.log(`Uptime: ${health.metrics.uptime}%`);
  
  return health.status === 'healthy' && health.raydium === 'connected';
}
```

### 2. Liquidity Pools
Retrieve authentic Raydium liquidity pool data.

**Endpoint:** `GET /api/pools`

**Response:**
```json
{
  "pools": [
    {
      "id": 1,
      "poolId": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
      "baseTokenMint": "So11111111111111111111111111111111111111112",
      "quoteTokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "lpTokenMint": "8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu",
      "baseTokenReserve": "2547891234567890",
      "quoteTokenReserve": "458932145678901",
      "tvl": 1250000.50,
      "volume24h": 850000.25,
      "apy": 125.75,
      "createdAt": "2025-05-24T03:57:20.123Z",
      "updatedAt": "2025-05-24T03:57:20.123Z"
    }
  ],
  "count": 1,
  "updated": "2025-05-24T03:57:20.123Z"
}
```

**Integration Example:**
```python
# Filter high-value pools
import requests

def get_high_tvl_pools(min_tvl: float = 1000000) -> list:
    response = requests.get('https://filotmicroservice.replit.app/api/pools')
    data = response.json()
    
    high_tvl_pools = [
        pool for pool in data['pools'] 
        if pool['tvl'] and pool['tvl'] >= min_tvl
    ]
    
    # Sort by TVL descending
    high_tvl_pools.sort(key=lambda x: x['tvl'], reverse=True)
    
    print(f"Found {len(high_tvl_pools)} pools with TVL >= ${min_tvl:,.2f}")
    return high_tvl_pools

# Usage
top_pools = get_high_tvl_pools(500000)  # Pools with $500k+ TVL
for pool in top_pools[:5]:  # Top 5
    print(f"Pool: {pool['poolId']} - TVL: ${pool['tvl']:,.2f}")
```

### 3. Specific Pool
Get detailed information for a specific pool.

**Endpoint:** `GET /api/pools/{poolId}`

**Parameters:**
- `poolId` (string): The unique pool identifier

**Example:**
```bash
curl https://filotmicroservice.replit.app/api/pools/58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2
```

### 4. Token Information
Retrieve authentic token metadata and pricing.

**Endpoint:** `GET /api/tokens`

**Response:**
```json
{
  "tokens": [
    {
      "id": 1,
      "symbol": "SOL",
      "name": "Solana",
      "mint": "So11111111111111111111111111111111111111112",
      "decimals": 9,
      "logoUri": "https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png",
      "price": 185.45,
      "volume24h": 45000000.00,
      "marketCap": 85000000000.00,
      "createdAt": "2025-05-24T03:57:20.123Z",
      "updatedAt": "2025-05-24T03:57:20.123Z"
    }
  ],
  "count": 1,
  "updated": "2025-05-24T03:57:20.123Z"
}
```

**Integration Example:**
```javascript
// Token price monitoring
class TokenPriceMonitor {
  constructor() {
    this.baseUrl = 'https://filotmicroservice.replit.app';
    this.watchlist = [];
    this.priceAlerts = new Map();
  }
  
  async addToWatchlist(tokenMint, alertPrice = null) {
    try {
      const response = await fetch(`${this.baseUrl}/api/tokens/${tokenMint}`);
      
      if (response.ok) {
        const token = await response.json();
        this.watchlist.push(token);
        
        if (alertPrice) {
          this.priceAlerts.set(tokenMint, alertPrice);
        }
        
        console.log(`Added ${token.symbol} to watchlist`);
        return token;
      } else {
        console.error(`Token not found: ${tokenMint}`);
        return null;
      }
    } catch (error) {
      console.error('Failed to add token to watchlist:', error);
      return null;
    }
  }
  
  async checkPriceAlerts() {
    const tokens = await fetch(`${this.baseUrl}/api/tokens`)
      .then(res => res.json());
    
    for (const token of tokens.tokens) {
      const alertPrice = this.priceAlerts.get(token.mint);
      
      if (alertPrice && token.price >= alertPrice) {
        this.triggerAlert(token, alertPrice);
      }
    }
  }
  
  triggerAlert(token, targetPrice) {
    console.log(`PRICE ALERT: ${token.symbol} reached $${token.price} (target: $${targetPrice})`);
    // Implement notification logic (email, webhook, etc.)
  }
}

// Usage
const monitor = new TokenPriceMonitor();
await monitor.addToWatchlist('So11111111111111111111111111111111111111112', 200); // SOL at $200
```

### 5. Swap Quote Calculation
Calculate authentic swap quotes using Raydium SDK.

**Endpoint:** `POST /api/swap/quote`

**Request Body:**
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": "1000000000",
  "slippage": 0.5
}
```

**Response:**
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "inputAmount": "1000000000",
  "outputAmount": "185450000",
  "priceImpact": "0.12",
  "slippage": 0.5,
  "route": ["Raydium AMM"],
  "minOutputAmount": "184525250"
}
```

**Integration Examples:**

#### Advanced Swap Calculator
```javascript
class SwapCalculator {
  constructor() {
    this.baseUrl = 'https://filotmicroservice.replit.app';
  }
  
  async calculateSwap(inputMint, outputMint, amount, slippage = 0.5) {
    const requestBody = {
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippage
    };
    
    try {
      const response = await fetch(`${this.baseUrl}/api/swap/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const quote = await response.json();
      
      return {
        ...quote,
        pricePerUnit: parseFloat(quote.outputAmount) / parseFloat(quote.inputAmount),
        effectivePrice: this.calculateEffectivePrice(quote),
        recommendedSlippage: this.recommendSlippage(quote.priceImpact)
      };
    } catch (error) {
      console.error('Swap calculation failed:', error);
      throw error;
    }
  }
  
  calculateEffectivePrice(quote) {
    const input = parseFloat(quote.inputAmount);
    const output = parseFloat(quote.outputAmount);
    return output / input;
  }
  
  recommendSlippage(priceImpact) {
    const impact = parseFloat(priceImpact);
    
    if (impact < 0.1) return 0.5;
    if (impact < 0.5) return 1.0;
    if (impact < 1.0) return 2.0;
    return 5.0; // High impact trades
  }
  
  async findBestRate(inputMint, amount, outputMints) {
    const quotes = await Promise.all(
      outputMints.map(async (outputMint) => {
        try {
          const quote = await this.calculateSwap(inputMint, outputMint, amount);
          return { outputMint, quote };
        } catch {
          return { outputMint, quote: null };
        }
      })
    );
    
    return quotes
      .filter(q => q.quote !== null)
      .sort((a, b) => parseFloat(b.quote.outputAmount) - parseFloat(a.quote.outputAmount));
  }
}

// Usage Examples
const calculator = new SwapCalculator();

// Single swap quote
const quote = await calculator.calculateSwap(
  'So11111111111111111111111111111111111111112',  // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  // USDC
  1000000000  // 1 SOL
);

console.log(`1 SOL = ${quote.pricePerUnit} USDC`);
console.log(`Price Impact: ${quote.priceImpact}%`);
console.log(`Recommended Slippage: ${quote.recommendedSlippage}%`);

// Compare rates across multiple tokens
const stablecoins = [
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',  // USDT
];

const bestRates = await calculator.findBestRate(
  'So11111111111111111111111111111111111111112',  // SOL
  1000000000,  // 1 SOL
  stablecoins
);

console.log('Best rates for 1 SOL:');
bestRates.forEach(({ outputMint, quote }, index) => {
  console.log(`${index + 1}. ${quote.outputAmount} (${outputMint.slice(0, 8)}...)`);
});
```

### 6. Token Account Parsing
Parse authentic token account data from Solana blockchain.

**Endpoint:** `POST /api/token-account/parse`

**Request Body:**
```json
{
  "accountData": "base64_encoded_account_data",
  "owner": "owner_public_key"
}
```

**Response:**
```json
{
  "mint": "Giajs249VSiuF3Ui5CKyKSxLTtUa6rFAxw5ZZ7dspump",
  "owner": "11111111111111111111111111111112",
  "amount": "17448792100",
  "decimals": 9,
  "uiAmount": 17.4487921,
  "uiAmountString": "17.4487921"
}
```

### 7. API Metrics
Access performance metrics and recent request logs.

**Endpoint:** `GET /api/metrics`

**Response:**
```json
{
  "totalRequests": 1850,
  "averageResponseTime": 38.5,
  "errorRate": 0.0,
  "uptime": 100,
  "recentRequests": [
    {
      "endpoint": "/api/swap/quote",
      "method": "POST",
      "responseTime": 149,
      "statusCode": 200,
      "timestamp": "2025-05-24T03:57:20.123Z"
    }
  ]
}
```

---

## Integration Examples

### React/Next.js Integration

```jsx
// hooks/useFilotApi.js
import { useState, useEffect } from 'react';

const BASE_URL = 'https://filotmicroservice.replit.app';

export function useApiHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${BASE_URL}/api/health`);
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    
    return () => clearInterval(interval);
  }, []);
  
  return { health, loading };
}

export function usePools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${BASE_URL}/api/pools`)
      .then(res => res.json())
      .then(data => {
        setPools(data.pools);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch pools:', error);
        setLoading(false);
      });
  }, []);
  
  return { pools, loading };
}

export function useSwapQuote(inputMint, outputMint, amount, slippage = 0.5) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const calculateQuote = async () => {
    if (!inputMint || !outputMint || !amount) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/api/swap/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputMint,
          outputMint,
          amount: amount.toString(),
          slippage
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { quote, loading, error, calculateQuote };
}

// components/SwapCalculator.jsx
import React, { useState } from 'react';
import { useSwapQuote } from '../hooks/useFilotApi';

export default function SwapCalculator() {
  const [inputMint, setInputMint] = useState('So11111111111111111111111111111111111111112');
  const [outputMint, setOutputMint] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const [amount, setAmount] = useState('1000000000');
  const [slippage, setSlippage] = useState(0.5);
  
  const { quote, loading, error, calculateQuote } = useSwapQuote(
    inputMint, 
    outputMint, 
    amount, 
    slippage
  );
  
  return (
    <div className="swap-calculator">
      <h2>Swap Calculator</h2>
      
      <div>
        <label>Input Token Mint:</label>
        <input 
          value={inputMint} 
          onChange={(e) => setInputMint(e.target.value)}
          placeholder="Token mint address"
        />
      </div>
      
      <div>
        <label>Output Token Mint:</label>
        <input 
          value={outputMint} 
          onChange={(e) => setOutputMint(e.target.value)}
          placeholder="Token mint address"
        />
      </div>
      
      <div>
        <label>Amount:</label>
        <input 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in smallest unit"
        />
      </div>
      
      <div>
        <label>Slippage (%):</label>
        <input 
          type="number" 
          value={slippage} 
          onChange={(e) => setSlippage(parseFloat(e.target.value))}
          step="0.1"
          min="0.1"
          max="10"
        />
      </div>
      
      <button onClick={calculateQuote} disabled={loading}>
        {loading ? 'Calculating...' : 'Get Quote'}
      </button>
      
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}
      
      {quote && (
        <div className="quote-result">
          <h3>Quote Result</h3>
          <p>Input Amount: {quote.inputAmount}</p>
          <p>Output Amount: {quote.outputAmount}</p>
          <p>Price Impact: {quote.priceImpact}%</p>
          <p>Route: {quote.route.join(' → ')}</p>
          <p>Minimum Output: {quote.minOutputAmount}</p>
        </div>
      )}
    </div>
  );
}
```

### Python Trading Bot Framework

```python
import asyncio
import aiohttp
import logging
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

@dataclass
class SwapQuote:
    input_mint: str
    output_mint: str
    input_amount: str
    output_amount: str
    price_impact: float
    slippage: float
    route: List[str]
    min_output_amount: str
    timestamp: datetime

class FilotApiClient:
    def __init__(self, base_url: str = "https://filotmicroservice.replit.app"):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None
        self.logger = logging.getLogger(__name__)
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={'Content-Type': 'application/json'}
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get_health(self) -> Dict[str, Any]:
        """Check API health status"""
        async with self.session.get(f"{self.base_url}/api/health") as response:
            response.raise_for_status()
            return await response.json()
    
    async def get_pools(self) -> List[Dict[str, Any]]:
        """Fetch all liquidity pools"""
        async with self.session.get(f"{self.base_url}/api/pools") as response:
            response.raise_for_status()
            data = await response.json()
            return data['pools']
    
    async def get_tokens(self) -> List[Dict[str, Any]]:
        """Fetch all tokens"""
        async with self.session.get(f"{self.base_url}/api/tokens") as response:
            response.raise_for_status()
            data = await response.json()
            return data['tokens']
    
    async def get_swap_quote(
        self, 
        input_mint: str, 
        output_mint: str, 
        amount: str, 
        slippage: float = 0.5
    ) -> SwapQuote:
        """Calculate swap quote"""
        payload = {
            "inputMint": input_mint,
            "outputMint": output_mint,
            "amount": amount,
            "slippage": slippage
        }
        
        async with self.session.post(
            f"{self.base_url}/api/swap/quote",
            json=payload
        ) as response:
            response.raise_for_status()
            data = await response.json()
            
            return SwapQuote(
                input_mint=data['inputMint'],
                output_mint=data['outputMint'],
                input_amount=data['inputAmount'],
                output_amount=data['outputAmount'],
                price_impact=float(data['priceImpact']),
                slippage=data['slippage'],
                route=data['route'],
                min_output_amount=data['minOutputAmount'],
                timestamp=datetime.now()
            )

class ArbitrageBot:
    def __init__(self, min_profit_threshold: float = 0.01):
        self.client = FilotApiClient()
        self.min_profit_threshold = min_profit_threshold
        self.logger = logging.getLogger(__name__)
        
    async def find_arbitrage_opportunities(
        self, 
        base_token: str, 
        quote_tokens: List[str],
        amount: str
    ) -> List[Dict[str, Any]]:
        """Find arbitrage opportunities across different token pairs"""
        opportunities = []
        
        async with self.client:
            # Check if API is healthy
            health = await self.client.get_health()
            if health['status'] != 'healthy':
                self.logger.warning("API not healthy, skipping arbitrage check")
                return opportunities
            
            # Get quotes for all pairs
            tasks = []
            for quote_token in quote_tokens:
                # Forward: base -> quote
                tasks.append(self.client.get_swap_quote(base_token, quote_token, amount))
                # Reverse: quote -> base (estimate)
                tasks.append(self.client.get_swap_quote(quote_token, base_token, "1000000"))
            
            try:
                quotes = await asyncio.gather(*tasks, return_exceptions=True)
                
                # Analyze for arbitrage opportunities
                for i in range(0, len(quotes), 2):
                    if isinstance(quotes[i], Exception) or isinstance(quotes[i+1], Exception):
                        continue
                        
                    forward_quote = quotes[i]
                    reverse_quote = quotes[i+1]
                    
                    # Calculate potential profit
                    profit_ratio = self.calculate_profit_ratio(forward_quote, reverse_quote)
                    
                    if profit_ratio > self.min_profit_threshold:
                        opportunities.append({
                            'base_token': base_token,
                            'quote_token': forward_quote.output_mint,
                            'profit_ratio': profit_ratio,
                            'forward_quote': forward_quote,
                            'reverse_quote': reverse_quote,
                            'timestamp': datetime.now()
                        })
                        
            except Exception as e:
                self.logger.error(f"Error finding arbitrage opportunities: {e}")
        
        return sorted(opportunities, key=lambda x: x['profit_ratio'], reverse=True)
    
    def calculate_profit_ratio(self, forward_quote: SwapQuote, reverse_quote: SwapQuote) -> float:
        """Calculate profit ratio for arbitrage opportunity"""
        try:
            # Simplified calculation - in practice, you'd need more complex logic
            forward_rate = float(forward_quote.output_amount) / float(forward_quote.input_amount)
            reverse_rate = float(reverse_quote.output_amount) / float(reverse_quote.input_amount)
            
            # Account for price impact and slippage
            adjusted_forward = forward_rate * (1 - forward_quote.price_impact / 100)
            adjusted_reverse = reverse_rate * (1 - reverse_quote.price_impact / 100)
            
            return (adjusted_forward * adjusted_reverse) - 1.0
        except (ValueError, ZeroDivisionError):
            return 0.0

# Usage Example
async def main():
    logging.basicConfig(level=logging.INFO)
    
    bot = ArbitrageBot(min_profit_threshold=0.005)  # 0.5% minimum profit
    
    # Define tokens to monitor
    SOL = "So11111111111111111111111111111111111111112"
    stable_coins = [
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
        "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",  # USDT
    ]
    
    # Look for arbitrage opportunities
    opportunities = await bot.find_arbitrage_opportunities(
        base_token=SOL,
        quote_tokens=stable_coins,
        amount="1000000000"  # 1 SOL
    )
    
    print(f"Found {len(opportunities)} arbitrage opportunities:")
    for opp in opportunities:
        print(f"  {opp['base_token'][:8]}... ↔ {opp['quote_token'][:8]}... "
              f"Profit: {opp['profit_ratio']:.2%}")

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 🧪 Testing & Validation

### Testing Framework
```javascript
// test/filot-api.test.js
const assert = require('assert');
const fetch = require('node-fetch');

const BASE_URL = 'https://filotmicroservice.replit.app';

describe('FiLotMicroservice API Tests', () => {
  
  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const data = await response.json();
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.status, 'healthy');
      assert.strictEqual(data.raydium, 'connected');
      assert(data.metrics);
    });
  });
  
  describe('Pools Endpoint', () => {
    it('should return pools data', async () => {
      const response = await fetch(`${BASE_URL}/api/pools`);
      const data = await response.json();
      
      assert.strictEqual(response.status, 200);
      assert(Array.isArray(data.pools));
      assert(typeof data.count === 'number');
      assert(data.updated);
    });
  });
  
  describe('Swap Quote', () => {
    it('should calculate swap quote for valid pairs', async () => {
      const payload = {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        amount: '1000000000',
        slippage: 0.5
      };
      
      const response = await fetch(`${BASE_URL}/api/swap/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.inputMint, payload.inputMint);
      assert.strictEqual(data.outputMint, payload.outputMint);
      assert(data.outputAmount);
      assert(Array.isArray(data.route));
    });
    
    it('should handle invalid token pairs gracefully', async () => {
      const payload = {
        inputMint: 'invalid_mint_address',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        amount: '1000000000',
        slippage: 0.5
      };
      
      const response = await fetch(`${BASE_URL}/api/swap/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      assert.strictEqual(response.status, 400);
    });
  });
  
  describe('Performance', () => {
    it('should respond within acceptable time limits', async () => {
      const start = Date.now();
      const response = await fetch(`${BASE_URL}/api/health`);
      const duration = Date.now() - start;
      
      assert.strictEqual(response.status, 200);
      assert(duration < 5000, `Response took ${duration}ms, expected < 5000ms`);
    });
  });
  
});
```

### Load Testing
```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 https://filotmicroservice.replit.app/api/health

# Using curl for continuous monitoring
watch -n 5 'curl -s https://filotmicroservice.replit.app/api/health | jq .status'
```

---

## Production Best Practices

### 1. Connection Management
```javascript
// Good: Reuse connections
class FilotApiClient {
  constructor() {
    this.baseUrl = 'https://filotmicroservice.replit.app';
    this.httpAgent = new http.Agent({ keepAlive: true });
  }
}

// Avoid: Creating new connections for each request
```

### 2. Caching Strategy
```javascript
class CachedApiClient {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }
  
  async getPoolsWithCache() {
    const cacheKey = 'pools';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const pools = await this.getPools();
    this.cache.set(cacheKey, {
      data: pools,
      timestamp: Date.now()
    });
    
    return pools;
  }
}
```

### 3. Error Recovery
```python
import asyncio
from typing import Callable, Any

async def with_retry(
    func: Callable,
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0
) -> Any:
    """Execute function with exponential backoff retry"""
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            
            delay = min(base_delay * (2 ** attempt), max_delay)
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
            await asyncio.sleep(delay)
```

### 4. Monitoring & Alerting
```javascript
class ApiMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      totalResponseTime: 0
    };
  }
  
  async monitoredRequest(url, options = {}) {
    const start = Date.now();
    this.metrics.requests++;
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        this.metrics.errors++;
        this.alertOnError(response.status, url);
      }
      
      return response;
    } catch (error) {
      this.metrics.errors++;
      this.alertOnError('NETWORK_ERROR', url);
      throw error;
    } finally {
      this.metrics.totalResponseTime += Date.now() - start;
    }
  }
  
  getErrorRate() {
    return this.metrics.requests > 0 
      ? this.metrics.errors / this.metrics.requests 
      : 0;
  }
  
  getAverageResponseTime() {
    return this.metrics.requests > 0 
      ? this.metrics.totalResponseTime / this.metrics.requests 
      : 0;
  }
  
  alertOnError(status, url) {
    if (this.getErrorRate() > 0.1) { // 10% error rate
      console.error(`High error rate detected: ${this.getErrorRate()}%`);
      // Implement alerting logic (email, Slack, etc.)
    }
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Token not found" Error
```javascript
// Problem: Token mint address doesn't exist in database
// Solution: Check if token exists first
async function safeGetToken(mint) {
  try {
    const response = await fetch(`${BASE_URL}/api/tokens/${mint}`);
    if (response.status === 404) {
      console.log('Token not found in FiLot database');
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
}
```

#### 2. Swap Quote Failures
```javascript
// Problem: Invalid token pair or insufficient liquidity
// Solution: Validate inputs and handle gracefully
async function calculateSwapWithValidation(inputMint, outputMint, amount) {
  // Validate mint addresses
  if (!isValidMintAddress(inputMint) || !isValidMintAddress(outputMint)) {
    throw new Error('Invalid mint address format');
  }
  
  // Check if tokens exist
  const [inputToken, outputToken] = await Promise.all([
    safeGetToken(inputMint),
    safeGetToken(outputMint)
  ]);
  
  if (!inputToken || !outputToken) {
    throw new Error('One or both tokens not found');
  }
  
  try {
    return await getSwapQuote(inputMint, outputMint, amount);
  } catch (error) {
    if (error.message.includes('insufficient liquidity')) {
      throw new Error('Insufficient liquidity for this pair');
    }
    throw error;
  }
}

function isValidMintAddress(address) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}
```

#### 3. Performance Issues
```javascript
// Problem: Slow response times
// Solution: Implement timeout and parallel requests
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Parallel requests for better performance
async function fetchMultipleEndpoints() {
  const [health, pools, tokens] = await Promise.all([
    fetchWithTimeout(`${BASE_URL}/api/health`),
    fetchWithTimeout(`${BASE_URL}/api/pools`),
    fetchWithTimeout(`${BASE_URL}/api/tokens`)
  ]);
  
  return {
    health: await health.json(),
    pools: await pools.json(),
    tokens: await tokens.json()
  };
}
```

### Debug Mode
```javascript
class DebugApiClient {
  constructor(debug = false) {
    this.debug = debug;
    this.requestLog = [];
  }
  
  async request(url, options = {}) {
    const startTime = Date.now();
    
    if (this.debug) {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      if (options.body) {
        console.log(`Request Body:`, JSON.parse(options.body));
      }
    }
    
    try {
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;
      
      const logEntry = {
        url,
        method: options.method || 'GET',
        status: response.status,
        duration,
        timestamp: new Date().toISOString()
      };
      
      this.requestLog.push(logEntry);
      
      if (this.debug) {
        console.log(`API Response: ${response.status} (${duration}ms)`);
      }
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (this.debug) {
        console.error(`API Error: ${error.message} (${duration}ms)`);
      }
      
      throw error;
    }
  }
  
  getRequestLog() {
    return this.requestLog;
  }
  
  clearLog() {
    this.requestLog = [];
  }
}

// Usage
const client = new DebugApiClient(true); // Enable debug mode
```

---

## Support & Resources

### API Status Page
Monitor real-time API status: `https://filotmicroservice.replit.app/api/health`

### Contact Information
- **Telegram:** [@Fi_lotbot](https://t.me/Fi_lotbot)
- **X (Twitter):** [@crazyrichla](https://x.com/crazyrichla)
- **Email:** support@filot.io
- **Location:** Dubai International Financial Centre

### Additional Resources
- **Official Documentation:** `https://filotmicroservice.replit.app/docs`
- **API Metrics:** `https://filotmicroservice.replit.app/api/metrics`
- **Health Status:** `https://filotmicroservice.replit.app/api/health`

---

## License & Terms

This API is provided free of charge for development and commercial use. By using this API, you agree to:

- Use the service responsibly and not abuse rate limits
- Not attempt to reverse engineer or compromise the service
- Acknowledge that this is a free service with no SLA guarantees
- Report any issues or suggestions to our support channels

**Disclaimer:** This API provides access to DeFi data and calculations. Users are responsible for validating all data before making financial decisions. FiLot is not responsible for any losses incurred from using this API.

---

*Last updated: May 24, 2025*
*Version: 1.0.0*