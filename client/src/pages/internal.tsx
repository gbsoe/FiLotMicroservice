import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Shield, ArrowRightLeft, Send, Key, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function InternalPage() {
  const [activeTab, setActiveTab] = useState("docs");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    inputMint: "So11111111111111111111111111111111111111112", // SOL
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    amountIn: "1000000000", // 1 SOL
    slippagePct: "0.5"
  });

  // Swap form state
  const [swapForm, setSwapForm] = useState({
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amountIn: "1000000000",
    slippagePct: "0.5",
    ownerPubkey: "",
    privateKey: ""
  });

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    fromPrivateKey: "",
    toPublicKey: "",
    amount: "1000000"
  });

  useEffect(() => {
    document.title = "Internal Swap Interface - FiLotMicroservice";
  }, []);

  const handleQuoteSwap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internal/quote-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Quote Retrieved",
        description: "Swap quote calculated successfully.",
      });
    } catch (error) {
      toast({
        title: "Quote Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSwap = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internal/execute-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swapForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Swap Executed",
        description: `Transaction ID: ${data.txid}`,
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/internal/transfer-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferForm)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Transfer Complete",
        description: `Transaction ID: ${data.txid}`,
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      {/* Security Warning */}
      <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 mx-4 mt-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-800 dark:text-red-200 font-medium">Internal Use Only</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              This interface handles real blockchain transactions with actual funds. Only authorized personnel should access this page.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Internal Swap Interface
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Direct access to Raydium SDK v2 swap functionality for internal operations
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-red-600 border-red-600">
              <Key className="w-3 h-3 mr-1" />
              Requires Private Keys
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <Wallet className="w-3 h-3 mr-1" />
              Live Mainnet
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <TabsTrigger value="docs" className="text-xs md:text-sm font-medium px-1 py-2 md:px-3 md:py-3 rounded-md">
              <span className="hidden md:inline">API Documentation</span>
              <span className="md:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="quote" className="text-xs md:text-sm font-medium px-1 py-2 md:px-3 md:py-3 rounded-md">
              <span className="hidden md:inline">Get Quote</span>
              <span className="md:hidden">Quote</span>
            </TabsTrigger>
            <TabsTrigger value="swap" className="text-xs md:text-sm font-medium px-1 py-2 md:px-3 md:py-3 rounded-md">
              <span className="hidden md:inline">Execute Swap</span>
              <span className="md:hidden">Swap</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="text-xs md:text-sm font-medium px-1 py-2 md:px-3 md:py-3 rounded-md">
              <span className="hidden md:inline">Transfer Tokens</span>
              <span className="md:hidden">Transfer</span>
            </TabsTrigger>
          </TabsList>

          {/* API Documentation Tab */}
          <TabsContent value="docs">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-2xl">Swap Transaction API Documentation</CardTitle>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                    Complete guide to the FiLotMicroservice Swap Transaction API with authentic Raydium SDK v2 integration
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* API Endpoints Section */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">API Endpoints</h3>
                    <div className="space-y-3">
                      
                      <div className="border rounded-lg p-3 md:p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">GET</Badge>
                          <code className="text-xs md:text-sm font-mono break-all">/api/health</code>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Service health check with API metrics and Raydium SDK status
                        </p>
                        <div className="text-xs md:text-sm">
                          <div><strong>Response Example:</strong></div>
                          <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "status": "healthy",
  "timestamp": "2025-05-24T05:27:03.123Z",
  "version": "1.0.0",
  "metrics": {
    "totalRequests": 150,
    "averageResponseTime": 40,
    "errorRate": 0,
    "uptime": 100
  }
}`}</pre>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3 md:p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">POST</Badge>
                          <code className="text-xs md:text-sm font-mono break-all">/api/internal/quote-swap</code>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Get authentic swap quotes using Raydium SDK v2 - calculates exact output amounts, fees, and price impact
                        </p>
                        <div className="text-xs md:text-sm space-y-3">
                          <div>
                            <strong>Required Fields:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                              <li><code>inputMint</code> (string) - Source token mint address</li>
                              <li><code>outputMint</code> (string) - Target token mint address</li>
                              <li><code>amountIn</code> (string) - Input amount in base units</li>
                              <li><code>slippagePct</code> (number, optional) - Slippage tolerance (default: 0.5)</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Request Example:</strong>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amountIn": "1000000000",
  "slippagePct": 0.5
}`}</pre>
                          </div>
                          <div>
                            <strong>Response Example:</strong>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "success": true,
  "quote": {
    "amountOut": "999500000",
    "minimumAmountOut": "994500250",
    "fee": "2500000",
    "priceImpact": 0.12,
    "route": ["So111...", "EPjFW..."]
  }
}`}</pre>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3 md:p-4 border-red-200">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 text-xs">POST</Badge>
                          <code className="text-xs md:text-sm font-mono break-all">/api/internal/execute-swap</code>
                          <Badge variant="destructive" className="text-xs">Internal Use Only</Badge>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Execute actual swap transaction on Solana mainnet using private key signing
                        </p>
                        <div className="text-xs md:text-sm space-y-3">
                          <div>
                            <strong>Required Fields:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                              <li><code>inputMint</code> (string) - Source token mint address</li>
                              <li><code>outputMint</code> (string) - Target token mint address</li>
                              <li><code>amountIn</code> (string) - Input amount in base units</li>
                              <li><code>ownerPubkey</code> (string) - Wallet public key</li>
                              <li><code>privateKey</code> (string|array) - Private key (base58 or number array)</li>
                              <li><code>slippagePct</code> (number, optional) - Slippage tolerance (default: 0.5)</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Request Example:</strong>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amountIn": "1000000000",
  "slippagePct": 0.5,
  "ownerPubkey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "privateKey": "base58_encoded_private_key"
}`}</pre>
                          </div>
                          <div>
                            <strong>Response Example:</strong>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "success": true,
  "txid": "5j8fK2M3N9pQ4R7sT6uV8wX1yZ2aB3cD4eF5gH6iJ7kL8mN9oP0q",
  "explorerUrl": "https://solscan.io/tx/5j8fK2M3N9pQ4R7sT6uV8w..."
}`}</pre>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2">
                            <strong className="text-amber-800 dark:text-amber-200">Security Note:</strong>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Private key validation ensures the provided public key matches before transaction execution.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3 md:p-4 border-orange-200">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs">POST</Badge>
                          <code className="text-xs md:text-sm font-mono break-all">/api/internal/transfer-token</code>
                          <Badge variant="destructive" className="text-xs">Internal Use Only</Badge>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Transfer SPL tokens between Solana wallets using secure private key authentication
                        </p>
                        <div className="text-xs md:text-sm space-y-3">
                          <div>
                            <strong>Required Fields:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                              <li><code>mint</code> (string) - SPL token mint address</li>
                              <li><code>fromPrivateKey</code> (string|array) - Sender's private key (base58 or number array)</li>
                              <li><code>toPublicKey</code> (string) - Recipient's wallet address</li>
                              <li><code>amount</code> (string) - Transfer amount in base units</li>
                            </ul>
                          </div>
                          <div>
                            <strong>Request Example:</strong>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "fromPrivateKey": "base58_encoded_private_key",
  "toPublicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "amount": "1000000"
}`}</pre>
                          </div>
                          <div>
                            <strong>Response Example:</strong>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "success": true,
  "txid": "2h7jK9L4M8nP5qR8sT1uV3wX0yZ9aB2cD7eF4gH5iJ6kL9mN0oP",
  "explorerUrl": "https://solscan.io/tx/2h7jK9L4M8nP5qR8sT1uV3w..."
}`}</pre>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                            <strong className="text-blue-800 dark:text-blue-200">Validation:</strong>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Recipient address validation ensures valid Solana public key before transfer execution.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">POST</Badge>
                          <code className="text-sm font-mono">/api/internal/parse-token-account</code>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Parse token account data using Raydium SDK v2 context
                        </p>
                        <div className="text-sm">
                          <div><strong>Request Body:</strong></div>
                          <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded mt-2 text-xs overflow-x-auto">{`{
  "accountData": "base64_encoded_account_data",
  "owner": "wallet_address"
}`}</pre>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Integration Examples Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Integration Examples</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">JavaScript/Node.js</h4>
                        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-x-auto">{`// Get swap quote
const response = await fetch('/api/raydium/quote-swap?' + 
  new URLSearchParams({
    inMint: 'So11111111111111111111111111111111111111112',
    outMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    amount: '1000000',
    slippagePct: '0.5'
  }));

const quote = await response.json();
console.log('Swap quote:', quote.data);`}</pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Python</h4>
                        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-x-auto">{`import requests

# Get swap quote
response = requests.get('/api/raydium/quote-swap', params={
    'inMint': 'So11111111111111111111111111111111111111112',
    'outMint': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'amount': '1000000',
    'slippagePct': 0.5
})

quote = response.json()
print('Swap quote:', quote['data'])`}</pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">cURL</h4>
                        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-x-auto">{`# Get swap quote
curl "/api/raydium/quote-swap?inMint=So11111111111111111111111111111111111111112&outMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000&slippagePct=0.5"

# Execute swap (requires PRIVATE_KEY)
curl -X POST /api/raydium/execute-swap \\
  -H "Content-Type: application/json" \\
  -d '{
    "inMint": "So11111111111111111111111111111111111111112",
    "outMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000",
    "slippagePct": 0.5
  }'`}</pre>
                      </div>
                    </div>
                  </div>

                  {/* Response Format Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Response Format</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Success Response</h4>
                        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-x-auto">{`{
  "success": true,
  "data": {
    // Response data specific to endpoint
  },
  "timestamp": "2025-05-24T05:11:30.123Z"
}`}</pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Error Response</h4>
                        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-sm overflow-x-auto">{`{
  "success": false,
  "error": "Error description",
  "timestamp": "2025-05-24T05:11:30.123Z"
}`}</pre>
                      </div>
                    </div>
                  </div>

                  {/* Environment Configuration Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Environment Configuration</h3>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Required Environment Variables</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm overflow-x-auto">{`# Server Configuration
PORT=3000
NODE_ENV=development

# Solana Configuration  
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Private Key (Required for execute/transfer endpoints)
PRIVATE_KEY=[123,45,67,89,...]  # JSON array or Base58 string

# Logging
LOG_LEVEL=info`}</pre>
                    </div>
                  </div>

                  {/* Security Notes Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Security Notes</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-red-800 dark:text-red-200">Private Key Security</div>
                          <div className="text-red-700 dark:text-red-300">
                            Execute and transfer endpoints require PRIVATE_KEY environment variable. Never expose private keys in production.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded">
                        <Shield className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-orange-800 dark:text-orange-200">Rate Limiting</div>
                          <div className="text-orange-700 dark:text-orange-300">
                            Rate limiting is enabled by default: 100 requests per 15 minutes per IP address.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
                        <Wallet className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-blue-800 dark:text-blue-200">Wallet Integration</div>
                          <div className="text-blue-700 dark:text-blue-300">
                            Consider implementing wallet adapters for user transactions in production environments.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quote Tab */}
          <TabsContent value="quote">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Swap Quote Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inputMint">Input Token Mint</Label>
                    <Input
                      id="inputMint"
                      value={quoteForm.inputMint}
                      onChange={(e) => setQuoteForm({...quoteForm, inputMint: e.target.value})}
                      placeholder="So11111111111111111111111111111111111111112"
                    />
                    <p className="text-xs text-slate-500 mt-1">SOL mint address</p>
                  </div>
                  <div>
                    <Label htmlFor="outputMint">Output Token Mint</Label>
                    <Input
                      id="outputMint"
                      value={quoteForm.outputMint}
                      onChange={(e) => setQuoteForm({...quoteForm, outputMint: e.target.value})}
                      placeholder="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                    />
                    <p className="text-xs text-slate-500 mt-1">USDC mint address</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amountIn">Amount In (smallest units)</Label>
                    <Input
                      id="amountIn"
                      value={quoteForm.amountIn}
                      onChange={(e) => setQuoteForm({...quoteForm, amountIn: e.target.value})}
                      placeholder="1000000000"
                    />
                    <p className="text-xs text-slate-500 mt-1">1 SOL = 1,000,000,000 lamports</p>
                  </div>
                  <div>
                    <Label htmlFor="slippagePct">Slippage %</Label>
                    <Input
                      id="slippagePct"
                      value={quoteForm.slippagePct}
                      onChange={(e) => setQuoteForm({...quoteForm, slippagePct: e.target.value})}
                      placeholder="0.5"
                    />
                    <p className="text-xs text-slate-500 mt-1">Recommended: 0.5%</p>
                  </div>
                </div>

                <Button 
                  onClick={handleQuoteSwap} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Getting Quote..." : "Get Swap Quote"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swap Tab */}
          <TabsContent value="swap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Send className="w-5 h-5" />
                  Execute Swap Transaction
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This will execute a real transaction on Solana mainnet using provided private keys.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="swapInputMint">Input Token Mint</Label>
                    <Input
                      id="swapInputMint"
                      value={swapForm.inputMint}
                      onChange={(e) => setSwapForm({...swapForm, inputMint: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="swapOutputMint">Output Token Mint</Label>
                    <Input
                      id="swapOutputMint"
                      value={swapForm.outputMint}
                      onChange={(e) => setSwapForm({...swapForm, outputMint: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="swapAmountIn">Amount In</Label>
                    <Input
                      id="swapAmountIn"
                      value={swapForm.amountIn}
                      onChange={(e) => setSwapForm({...swapForm, amountIn: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="swapSlippage">Slippage %</Label>
                    <Input
                      id="swapSlippage"
                      value={swapForm.slippagePct}
                      onChange={(e) => setSwapForm({...swapForm, slippagePct: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ownerPubkey">Owner Public Key</Label>
                  <Input
                    id="ownerPubkey"
                    value={swapForm.ownerPubkey}
                    onChange={(e) => setSwapForm({...swapForm, ownerPubkey: e.target.value})}
                    placeholder="Wallet public key"
                  />
                </div>

                <div>
                  <Label htmlFor="privateKey">Private Key (Base58 or Array)</Label>
                  <Textarea
                    id="privateKey"
                    value={swapForm.privateKey}
                    onChange={(e) => setSwapForm({...swapForm, privateKey: e.target.value})}
                    placeholder="[1,2,3...] or base58 string"
                    className="min-h-20"
                  />
                  <p className="text-xs text-red-500 mt-1">Warning: Never share private keys. This data is not stored.</p>
                </div>

                <Button 
                  onClick={handleExecuteSwap} 
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {loading ? "Executing Swap..." : "Execute Swap (MAINNET)"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Send className="w-5 h-5" />
                  Transfer SPL Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferMint">Token Mint Address</Label>
                  <Input
                    id="transferMint"
                    value={transferForm.mint}
                    onChange={(e) => setTransferForm({...transferForm, mint: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="fromPrivateKey">From Private Key</Label>
                  <Textarea
                    id="fromPrivateKey"
                    value={transferForm.fromPrivateKey}
                    onChange={(e) => setTransferForm({...transferForm, fromPrivateKey: e.target.value})}
                    placeholder="[1,2,3...] or base58 string"
                    className="min-h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="toPublicKey">Recipient Public Key</Label>
                  <Input
                    id="toPublicKey"
                    value={transferForm.toPublicKey}
                    onChange={(e) => setTransferForm({...transferForm, toPublicKey: e.target.value})}
                    placeholder="Recipient wallet address"
                  />
                </div>

                <div>
                  <Label htmlFor="transferAmount">Amount (smallest units)</Label>
                  <Input
                    id="transferAmount"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                    placeholder="1000000"
                  />
                  <p className="text-xs text-slate-500 mt-1">1 USDC = 1,000,000 (6 decimals)</p>
                </div>

                <Button 
                  onClick={handleTransferToken} 
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? "Transferring..." : "Transfer Tokens (MAINNET)"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results Display */}
        {results && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}