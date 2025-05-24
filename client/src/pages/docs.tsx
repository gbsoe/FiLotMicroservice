import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ArrowRightLeft, CheckCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

const endpoints = [
  {
    id: "health",
    method: "GET",
    path: "/api/health",
    title: "Health Check",
    description: "Check API service status and connectivity"
  },
  {
    id: "pools",
    method: "GET", 
    path: "/api/pools",
    title: "Get All Pools",
    description: "Retrieve all available liquidity pools with metadata"
  },
  {
    id: "pool-by-id",
    method: "GET",
    path: "/api/pools/:poolId",
    title: "Get Pool by ID",
    description: "Retrieve specific pool information by pool ID"
  },
  {
    id: "tokens",
    method: "GET",
    path: "/api/tokens",
    title: "Get All Tokens",
    description: "Retrieve all available tokens with metadata and market data"
  },
  {
    id: "token-by-mint",
    method: "GET",
    path: "/api/tokens/:mint",
    title: "Get Token by Mint",
    description: "Retrieve specific token information by mint address"
  },
  {
    id: "swap-quote",
    method: "POST",
    path: "/api/swap/quote",
    title: "Get Swap Quote",
    description: "Calculate swap quotes with price impact and slippage"
  },
  {
    id: "token-parse",
    method: "POST",
    path: "/api/token-account/parse",
    title: "Parse Token Account",
    description: "Parse token account data to extract balance and metadata"
  },
  {
    id: "metrics",
    method: "GET",
    path: "/api/metrics",
    title: "API Metrics",
    description: "Get API performance metrics and usage statistics"
  },
  {
    id: "docs",
    method: "GET",
    path: "/api/docs",
    title: "API Documentation",
    description: "Get OpenAPI/Swagger documentation"
  }
];

export default function DocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState("health");
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "API Documentation - FiLotMicroservice | Raydium SDK v2 Integration";
  }, []);

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

  const getEndpointExample = (endpoint: any, language: string) => {
    const baseUrl = window.location.origin;
    
    if (endpoint.id === "health") {
      switch (language) {
        case "curl":
          return `curl -X GET ${baseUrl}/api/health`;
        case "javascript":
          return `const response = await fetch('/api/health');
const data = await response.json();
console.log('API Status:', data.status);`;
        case "python":
          return `import requests

response = requests.get('${baseUrl}/api/health')
data = response.json()
print("API Status:", data['status'])`;
        case "nodejs":
          return `const axios = require('axios');

const checkHealth = async () => {
  try {
    const response = await axios.get('${baseUrl}/api/health');
    console.log('API Status:', response.data.status);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
  }
};

checkHealth();`;
      }
    }
    
    if (endpoint.id === "pools") {
      switch (language) {
        case "curl":
          return `curl -X GET ${baseUrl}/api/pools`;
        case "javascript":
          return `const response = await fetch('/api/pools');
const data = await response.json();

// Filter high TVL pools
const highTvlPools = data.pools.filter(pool => pool.tvl > 1000000);
console.log('Found ' + highTvlPools.length + ' high TVL pools');`;
        case "python":
          return `import requests

response = requests.get('${baseUrl}/api/pools')
data = response.json()

# Filter pools by minimum TVL
high_tvl_pools = [pool for pool in data['pools'] if pool['tvl'] > 1000000]
print("High TVL pools:", len(high_tvl_pools))`;
        case "nodejs":
          return `const axios = require('axios');

const getPools = async () => {
  try {
    const response = await axios.get('${baseUrl}/api/pools');
    const pools = response.data.pools;
    
    console.log('Total pools:', pools.length);
    return pools;
  } catch (error) {
    console.error('Failed to fetch pools:', error);
  }
};

getPools();`;
      }
    }

    // Default example for other endpoints
    const method = endpoint.method.toLowerCase();
    const path = endpoint.path.replace(':poolId', '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2').replace(':mint', 'So11111111111111111111111111111111111111112');
    
    switch (language) {
      case "curl":
        return `curl -X ${endpoint.method} ${baseUrl}${path}`;
      case "javascript":
        return `const response = await fetch('${path}');
const data = await response.json();
console.log(data);`;
      case "python":
        return `import requests

response = requests.${method}('${baseUrl}${path}')
data = response.json()
print(data)`;
      case "nodejs":
        return `const axios = require('axios');

const getData = async () => {
  try {
    const response = await axios.${method}('${baseUrl}${path}');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error);
  }
};

getData();`;
    }
    
    return "// Example code";
  };

  const currentEndpoint = endpoints.find(e => e.id === activeEndpoint) || endpoints[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      {/* Documentation Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">API Documentation</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">FiLotMicroservice - Precision Investing API</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="whitespace-nowrap">
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-900 dark:text-white">All 9 Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0.5">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        onClick={() => setActiveEndpoint(endpoint.id)}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                          activeEndpoint === endpoint.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-3 border-blue-600'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{endpoint.title}</span>
                          <Badge 
                            variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                            className={`text-xs font-medium ${
                              endpoint.method === 'GET' 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {endpoint.path}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Badge 
                    variant={currentEndpoint.method === 'GET' ? 'default' : 'secondary'}
                    className={`w-fit text-sm font-medium px-3 py-1 ${
                      currentEndpoint.method === 'GET' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}
                  >
                    {currentEndpoint.method}
                  </Badge>
                  <CardTitle className="text-xl sm:text-2xl font-mono text-slate-900 dark:text-white break-all">
                    {currentEndpoint.path}
                  </CardTitle>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-3 text-base leading-relaxed">
                  {currentEndpoint.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Code Examples</h3>
                  <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
                      <TabsTrigger value="curl" className="text-sm">cURL</TabsTrigger>
                      <TabsTrigger value="javascript" className="text-sm">JavaScript</TabsTrigger>
                      <TabsTrigger value="python" className="text-sm">Python</TabsTrigger>
                      <TabsTrigger value="nodejs" className="text-sm">Node.js</TabsTrigger>
                    </TabsList>
                    
                    {['curl', 'javascript', 'python', 'nodejs'].map((language) => (
                      <TabsContent key={language} value={language} className="mt-0">
                        <div className="relative group">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(getEndpointExample(currentEndpoint, language))}
                            className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <pre className="bg-slate-900 dark:bg-slate-950 text-green-400 dark:text-green-300 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed shadow-inner">
                            <code className="font-mono">{getEndpointExample(currentEndpoint, language)}</code>
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
      
      <Footer />
    </div>
  );
}