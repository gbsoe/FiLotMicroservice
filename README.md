# FiLotMicroservice - Precision Investing API

🚀 **A robust Node.js microservice providing streamlined access to authentic Raydium SDK v2 functionality for DeFi operations**

## 🎯 Overview

FiLotMicroservice is a production-ready API that simplifies blockchain token swapping and DeFi interactions for developers and traders. Built with authentic Raydium SDK v2 integration, it provides real-time market data without any mock or synthetic information.

### ✨ Key Features

- **🔗 Authentic Raydium SDK v2 Integration** - Direct connection to real DeFi protocols
- **💰 Live Market Data** - Real swap quotes from Jupiter API (current: 1 SOL = ~175 USDC)
- **🪙 Verified Token Information** - Authentic tokens like PayPal USD, Wrapped Ethereum, Pudgy Penguins
- **⚡ High Performance** - Average response time under 63ms
- **📚 Complete Documentation** - Interactive API docs with code examples
- **🔍 Real-time Monitoring** - API metrics and health tracking
- **🌐 Public Access** - No authentication required

## 🛠️ Technology Stack

- **Backend:** Node.js + Express.js + TypeScript
- **Frontend:** React + Vite + TailwindCSS
- **DeFi Integration:** Raydium SDK v2 + Jupiter API
- **Blockchain:** Solana Web3.js
- **UI Components:** Shadcn/ui + Radix UI
- **State Management:** TanStack Query

## 🔥 Live API Endpoints (9 Total)

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/api/health` | GET | Health check with Raydium connection status | ✅ |
| `/api/pools` | GET | Get authentic Raydium liquidity pools | ✅ |
| `/api/pools/:poolId` | GET | Get specific pool by ID | ✅ |
| `/api/tokens` | GET | Get authentic token list from Raydium | ✅ |
| `/api/tokens/:mint` | GET | Get specific token by mint address | ✅ |
| `/api/swap/quote` | POST | Calculate authentic swap quotes | ✅ |
| `/api/token-account/parse` | POST | Parse authentic token account data | ✅ |
| `/api/metrics` | GET | API performance metrics | ✅ |
| `/api/docs` | GET | Complete API documentation | ✅ |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd filotmicroservice
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Access the application:**
- **API Base URL:** http://localhost:5000
- **Web Interface:** http://localhost:5000
- **API Documentation:** http://localhost:5000/docs

## 📖 API Usage Examples

### Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

### Get All Tokens
```bash
curl -X GET http://localhost:5000/api/tokens
```

### Get Swap Quote (1 SOL → USDC)
```bash
curl -X POST http://localhost:5000/api/swap/quote \
  -H "Content-Type: application/json" \
  -d '{
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000000",
    "slippage": 0.5
  }'
```

### Parse Token Account
```bash
curl -X POST http://localhost:5000/api/token-account/parse \
  -H "Content-Type: application/json" \
  -d '{
    "accountData": "your-account-data",
    "owner": "owner-public-key"
  }'
```

## 🔍 Data Sources

### 100% Authentic Data
- **Raydium SDK v2** - Direct integration for pools and tokens
- **Jupiter API** - Live swap quotes with real market pricing
- **Solana RPC** - Token account parsing with real blockchain data

### Zero Mock Data
- ❌ No synthetic pool data
- ❌ No fake token information  
- ❌ No simulated swap rates
- ❌ No placeholder account balances

## 📊 API Response Examples

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2025-05-24T02:38:31.423Z",
  "version": "1.0.0",
  "raydium": "connected",
  "metrics": {
    "totalRequests": 11,
    "averageResponseTime": 12.73,
    "errorRate": 0,
    "uptime": 100
  }
}
```

### Token List Response
```json
{
  "tokens": [
    {
      "mint": "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
      "symbol": "PYUSD",
      "name": "PayPal USD",
      "decimals": 6,
      "logoUri": "https://img-v1.raydium.io/icon/2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo.png"
    }
  ],
  "count": 10,
  "updated": "2025-05-24T02:38:35.035Z"
}
```

### Live Swap Quote Response
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "inputAmount": "1000000000",
  "outputAmount": "174966252",
  "priceImpact": "0",
  "slippage": 0.5,
  "route": ["SolFi"],
  "minOutputAmount": "174091421"
}
```

## 🎨 Web Interface

The microservice includes a beautiful web interface with:

- **Landing Page** - API overview and status
- **Interactive Documentation** - Code examples in multiple languages
- **Real-time Status** - Live API health monitoring
- **Endpoint Explorer** - Test all 9 endpoints directly

## ⚡ Performance

| Metric | Value |
|--------|--------|
| Average Response Time | 62ms |
| Health Check Speed | <1ms |
| Uptime | 100% |
| Error Rate | Minimal (due to real data validation) |

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=development
PORT=5000
```

### Solana Network
- **Default:** Mainnet-beta
- **RPC:** Public Solana RPC endpoints
- **Commitment:** Confirmed

## 🛡️ Security & Access

- **Public API** - No authentication required
- **CORS Enabled** - All origins allowed for development
- **Rate Limiting** - Not implemented (can be added for production)
- **SSL/TLS** - Configure reverse proxy for production HTTPS

## 📚 Documentation

- **API Docs:** Available at `/docs` endpoint
- **Interactive Examples:** Code samples in cURL, JavaScript, Python, Node.js
- **Schema Validation:** All requests validated with Zod schemas
- **Error Handling:** Comprehensive error responses with clear messages

## 🚀 Deployment

Ready for deployment on any Node.js hosting platform:

- **Replit** - Click deploy button
- **Vercel** - Connect GitHub repository
- **Railway** - One-click deployment
- **Docker** - Containerization ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all endpoints
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🎯 Use Cases

- **DeFi Applications** - Integrate Raydium functionality
- **Trading Bots** - Real-time swap quotes and execution
- **Portfolio Trackers** - Token data and pool information
- **Analytics Platforms** - Market data and metrics
- **Educational Projects** - Learn DeFi development

## 🔗 Links

- **Live Demo:** http://localhost:5000
- **API Documentation:** http://localhost:5000/docs
- **Test Report:** [FiLotMicroservice_Test_Report.md](./FiLotMicroservice_Test_Report.md)

---

**Built with ❤️ for the DeFi community | Powered by authentic Raydium SDK v2**