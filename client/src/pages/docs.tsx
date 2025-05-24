import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ArrowRightLeft, CheckCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const endpoints = [
  {
    id: "health",
    method: "GET",
    path: "/api/health",
    title: "Health Check",
    description: "Check API service status and connectivity",
    response: `{
  "status": "healthy",
  "timestamp": "2025-05-24T01:22:30.012Z",
  "version": "1.0.0",
  "metrics": {
    "totalRequests": 32,
    "averageResponseTime": 1.0625,
    "errorRate": 0,
    "uptime": 100
  }
}`,
    examples: {
      curl: "curl -X GET https://your-domain.com/api/health",
      javascript: `const response = await fetch('/api/health');
const data = await response.json();
console.log('API Status:', data.status);`,
      python: `import requests

response = requests.get('https://your-domain.com/api/health')
data = response.json()
print("API Status:", data['status'])`,
      nodejs: `const axios = require('axios');

const checkHealth = async () => {
  try {
    const response = await axios.get('https://your-domain.com/api/health');
    console.log('API Status:', response.data.status);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
  }
};

checkHealth();`
    }
  },
  {
    id: "pools",
    method: "GET", 
    path: "/api/pools",
    title: "Get All Pools",
    description: "Retrieve all available liquidity pools with metadata",
    response: `{
  "pools": [
    {
      "id": 1,
      "poolId": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
      "baseTokenMint": "So11111111111111111111111111111111111111112",
      "quoteTokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "tvl": 1250000,
      "volume24h": 2500000,
      "apy": 15.5
    }
  ],
  "count": 2,
  "updated": "2025-05-24T01:22:32.986Z"
}`,
    examples: {
      curl: "curl -X GET https://your-domain.com/api/pools",
      javascript: `const response = await fetch('/api/pools');
const data = await response.json();

// Filter high TVL pools
const highTvlPools = data.pools.filter(pool => pool.tvl > 1000000);
console.log('Found ' + highTvlPools.length + ' high TVL pools');`,
      python: `import requests

response = requests.get('https://your-domain.com/api/pools')
data = response.json()

# Filter pools by minimum TVL
high_tvl_pools = [
    pool for pool in data['pools'] 
    if pool['tvl'] > 1000000  # $1M+ TVL
]

print("High TVL pools:", len(high_tvl_pools))`,
      nodejs: `const axios = require('axios');

const getPools = async () => {
  try {
    const response = await axios.get('https://your-domain.com/api/pools');
    const pools = response.data.pools;
    
    // Sort by TVL descending
    const sortedPools = pools.sort((a, b) => b.tvl - a.tvl);
    
    console.log('Top pools by TVL:');
    sortedPools.slice(0, 5).forEach((pool, index) => {
      console.log((index + 1) + '. TVL: $' + pool.tvl.toLocaleString() + ', APY: ' + pool.apy + '%');
    });
    
    return sortedPools;
  } catch (error) {
    console.error('Failed to fetch pools:', error);
  }
};

getPools();`
    }
  },
  {
    id: "swap-quote",
    method: "POST",
    path: "/api/swap/quote",
    title: "Get Swap Quote",
    description: "Calculate swap quotes with price impact and slippage",
    requestBody: `{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": "1000000000",
  "slippage": 0.5
}`,
    response: `{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "inputAmount": "1000000000",
  "outputAmount": "94773750000",
  "priceImpact": 0.05,
  "slippage": 0.5,
  "route": ["So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"],
  "minOutputAmount": "94299881250"
}`,
    examples: {
      curl: `curl -X POST https://your-domain.com/api/swap/quote \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000000",
    "slippage": 0.5
  }'`,
      javascript: `const swapQuote = async (inputAmount, slippage = 0.5) => {
  const response = await fetch('/api/swap/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputMint: 'So11111111111111111111111111111111111111112', // SOL
      outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      amount: inputAmount,
      slippage: slippage
    }),
  });

  const quote = await response.json();
  
  // Convert to human-readable amounts
  const inputSOL = parseInt(quote.inputAmount) / 1e9;
  const outputUSDC = parseInt(quote.outputAmount) / 1e6;
  const rate = outputUSDC / inputSOL;
  
  console.log('Swapping ' + inputSOL + ' SOL for ' + outputUSDC.toFixed(2) + ' USDC');
  console.log('Rate: 1 SOL = $' + rate.toFixed(2) + ' USDC');
  console.log('Price Impact: ' + quote.priceImpact + '%');
  
  return quote;
};

// Example: Get quote for 1 SOL
swapQuote('1000000000');`,
      python: `import requests
import json

def get_swap_quote(input_amount, input_mint, output_mint, slippage=0.5):
    payload = {
        "inputMint": input_mint,
        "outputMint": output_mint,
        "amount": str(input_amount),
        "slippage": slippage
    }
    
    response = requests.post(
        'https://your-domain.com/api/swap/quote',
        headers={'Content-Type': 'application/json'},
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        quote = response.json()
        input_readable = int(quote['inputAmount']) / 1e9
        output_readable = int(quote['outputAmount']) / 1e6
        rate = output_readable / input_readable
        
        print("Swapping {:.1f} SOL for {:.2f} USDC".format(input_readable, output_readable))
        print("Rate: 1 SOL = {:.2f} USDC".format(rate))
        print("Price Impact: {}%".format(quote['priceImpact']))
        
        return quote
    else:
        print("Error:", response.status_code)
        return None

# Example usage
sol_mint = "So11111111111111111111111111111111111111112"
usdc_mint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
get_swap_quote(1000000000, sol_mint, usdc_mint)`,
      nodejs: `const axios = require('axios');

const getSwapQuote = async (inputMint, outputMint, amount, slippage = 0.5) => {
  try {
    const response = await axios.post('https://your-domain.com/api/swap/quote', {
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippage
    });

    const quote = response.data;
    console.log('Swap Quote:');
    console.log('- Output Amount:', parseInt(quote.outputAmount) / 1e6, 'USDC');
    console.log('- Price Impact:', quote.priceImpact + '%');
    console.log('- Min Output:', parseInt(quote.minOutputAmount) / 1e6, 'USDC');
    
    return quote;
  } catch (error) {
    console.error('Swap quote error:', error.response?.data || error.message);
    throw error;
  }
};

// Example usage
getSwapQuote(
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  1000000000 // 1 SOL
);`
    }
  }
];

export default function DocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState("health");
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Code example has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const currentEndpoint = endpoints.find(e => e.id === activeEndpoint) || endpoints[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
                <p className="text-slate-600">FiLotMicroservice - Precision Investing API</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-emerald-100 text-emerald-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live API
            </Badge>
            <Badge variant="outline">Version 1.0.0</Badge>
            <Badge variant="outline">No Authentication Required</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left px-4 py-3 rounded-none border-0 transition-colors ${
                        activeEndpoint === endpoint.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{endpoint.title}</span>
                        <Badge 
                          className={`text-xs ${
                            endpoint.method === 'GET' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-mono">
                        {endpoint.path}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Endpoint Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center space-x-3">
                      <Badge className={
                        currentEndpoint.method === 'GET' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }>
                        {currentEndpoint.method}
                      </Badge>
                      <span className="font-mono">{currentEndpoint.path}</span>
                    </CardTitle>
                    <p className="text-slate-600 mt-2">{currentEndpoint.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Request Body */}
                {currentEndpoint.requestBody && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Request Body</h3>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        <code>{currentEndpoint.requestBody}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response Example */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Response Example</h3>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      <code>{currentEndpoint.response}</code>
                    </pre>
                  </div>
                </div>

                {/* Code Examples */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Code Examples</h3>
                  <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(currentEndpoint.examples).map(([language, code]) => (
                      <TabsContent key={language} value={language}>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code)}
                            className="absolute top-2 right-2 z-10"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{code}</code>
                          </pre>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}