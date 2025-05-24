import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const examples = {
  javascript: {
    title: "Get Swap Quote",
    code: `// Fetch swap quote for SOL to USDC
const response = await fetch('https://filotmicroservice.replit.app/api/swap/quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    inputMint: 'So11111111111111111111111111111111111111112', // SOL
    outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    amount: '1000000000', // 1 SOL
  }),
});

const quote = await response.json();
console.log('Expected output:', quote.outputAmount);
console.log('Price impact:', quote.priceImpact);`,
  },
  python: {
    title: "Get Pool Information",
    code: `import requests
import json

# Get all available pools
response = requests.get('https://filotmicroservice.replit.app/api/pools')
pools = response.json()

print(f"Found {pools['count']} pools")

# Filter pools by minimum TVL
high_tvl_pools = [
    pool for pool in pools['pools'] 
    if pool['tvl'] > 1000000  # $1M+ TVL
]

print(f"High TVL pools: {len(high_tvl_pools)}")`,
  },
  curl: {
    title: "Health Check",
    code: `# Check API health status
curl -X GET https://filotmicroservice.replit.app/api/health

# Get token information
curl -X GET https://filotmicroservice.replit.app/api/tokens/So11111111111111111111111111111111111111112

# Request swap quote
curl -X POST https://filotmicroservice.replit.app/api/swap/quote \\
  -H "Content-Type: application/json" \\
  -d '{
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000000"
  }'`,
  },
};

export default function Examples() {
  const [activeTab, setActiveTab] = useState<keyof typeof examples>('javascript');
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

  return (
    <section id="examples" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Quick Start Examples</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get up and running in minutes with these code examples
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="border-b border-slate-200 mb-8">
            <nav className="flex space-x-8">
              {Object.entries(examples).map(([key, example]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as keyof typeof examples)}
                  className={`py-4 px-1 border-b-2 font-medium capitalize ${
                    activeTab === key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {key}
                </button>
              ))}
            </nav>
          </div>
          
          <Card className="bg-slate-900 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{examples[activeTab].title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(examples[activeTab].code)}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                <code>{examples[activeTab].code}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
