# FiLotMicroservice - Swap Transaction API

**Precision Investing**

A robust Node.js microservice providing streamlined access to authentic Raydium SDK v2 functionality for blockchain token swapping and interaction processes.

## Features

- **Authentic Raydium SDK v2 Integration** - Direct access to Raydium's DeFi protocols
- **RESTful API Endpoints** - Clean, well-documented endpoints for all swap operations
- **TypeScript Support** - Full type safety and intellisense
- **Comprehensive Validation** - Input validation using Zod schemas
- **Security Hardened** - Rate limiting, CORS, and security headers
- **Production Ready** - Structured logging, error handling, and health checks

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Solana Configuration  
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Private Key (Optional - for execute endpoints)
PRIVATE_KEY=[123,45,67,89,...]  # JSON array or Base58 string

# Logging
LOG_LEVEL=info
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Service health status

### Raydium Operations

#### Quote Swap
- **GET** `/api/raydium/quote-swap`
- Get authentic swap quotes from Raydium pools
- **Query Parameters:**
  - `inMint` (string) - Input token mint address
  - `outMint` (string) - Output token mint address
  - `amount` (string) - Input amount in base units
  - `slippagePct` (number, optional) - Slippage percentage (default: 0.5)

#### Build Swap Transaction
- **POST** `/api/raydium/build-swap`
- Build unsigned swap transaction for user signing
- **Body:**
  ```json
  {
    "inMint": "So11111111111111111111111111111111111111112",
    "outMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 
    "amount": "1000000",
    "slippagePct": 0.5,
    "ownerPubkey": "user_wallet_address"
  }
  ```

#### Execute Swap (Requires Private Key)
- **POST** `/api/raydium/execute-swap`
- Execute swap using configured private key
- **Body:**
  ```json
  {
    "inMint": "So11111111111111111111111111111111111111112",
    "outMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000", 
    "slippagePct": 0.5
  }
  ```

#### Transfer Token (Requires Private Key)
- **POST** `/api/raydium/transfer-token`
- Transfer SPL tokens between accounts
- **Body:**
  ```json
  {
    "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "toPubkey": "recipient_wallet_address",
    "amount": "1000000"
  }
  ```

#### Health Check
- **GET** `/api/raydium/health` - Raydium service status

## Response Format

All endpoints return standardized JSON responses:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2025-05-24T05:11:30.123Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2025-05-24T05:11:30.123Z"
}
```

## Development

### Project Structure

```
src/
├── index.ts          # Main application entry point
├── config.ts         # Configuration management
├── logger.ts         # Winston logging setup
├── models.ts         # TypeScript interfaces and types
├── routes/
│   └── raydium.ts    # Raydium API routes
└── services/
    └── raydium.ts    # Raydium SDK integration
```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Security Notes

- The execute and transfer endpoints require a `PRIVATE_KEY` environment variable
- Never expose private keys in production - use secure key management
- Consider implementing wallet adapters for user transactions
- Rate limiting is enabled by default (100 requests per 15 minutes)

## Integration Examples

### JavaScript/Node.js

```javascript
// Get swap quote
const response = await fetch('http://localhost:3000/api/raydium/quote-swap?' + 
  new URLSearchParams({
    inMint: 'So11111111111111111111111111111111111111112',
    outMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    amount: '1000000',
    slippagePct: '0.5'
  }));

const quote = await response.json();
console.log('Swap quote:', quote.data);
```

### Python

```python
import requests

# Get swap quote
response = requests.get('http://localhost:3000/api/raydium/quote-swap', params={
    'inMint': 'So11111111111111111111111111111111111111112',
    'outMint': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'amount': '1000000',
    'slippagePct': 0.5
})

quote = response.json()
print('Swap quote:', quote['data'])
```

### cURL

```bash
# Get swap quote
curl "http://localhost:3000/api/raydium/quote-swap?inMint=So11111111111111111111111111111111111111112&outMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000&slippagePct=0.5"

# Execute swap (requires PRIVATE_KEY)
curl -X POST http://localhost:3000/api/raydium/execute-swap \
  -H "Content-Type: application/json" \
  -d '{
    "inMint": "So11111111111111111111111111111111111111112",
    "outMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000",
    "slippagePct": 0.5
  }'
```

## Support

- **Telegram:** [@Fi_lotbot](https://t.me/Fi_lotbot)
- **X (Twitter):** [@crazyrichla](https://x.com/crazyrichla)
- **Email:** support@filot.io
- **Location:** Dubai International Financial Centre

## License

MIT License - See LICENSE file for details

---

**FiLotMicroservice** - Building the future of decentralized finance with precision and reliability.