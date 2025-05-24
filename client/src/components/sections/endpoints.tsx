import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/health",
    description: "Check API service status and connectivity",
    category: "Health Check",
    methodColor: "bg-emerald-100 text-emerald-800",
    response: `{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}`,
  },
  {
    method: "GET",
    path: "/api/pools",
    description: "Get all available liquidity pools with metadata",
    category: "Pool Information",
    methodColor: "bg-emerald-100 text-emerald-800",
    response: `{
  "pools": [...],
  "count": 156,
  "updated": "2024-01-15T10:30:00Z"
}`,
  },
  {
    method: "POST",
    path: "/api/swap/quote",
    description: "Calculate swap quotes and price impact",
    category: "Swap Quote",
    methodColor: "bg-blue-100 text-blue-800",
    request: `{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": "1000000000"
}`,
  },
  {
    method: "GET",
    path: "/api/tokens/:mint",
    description: "Get detailed token information and metadata",
    category: "Token Data",
    methodColor: "bg-emerald-100 text-emerald-800",
    example: "GET /api/tokens/So11111111111111111111111111111111111111112",
  },
];

export default function Endpoints() {
  return (
    <section id="endpoints" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">API Endpoints</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            RESTful endpoints for precision investing and DeFi analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={endpoint.methodColor}>
                    {endpoint.method}
                  </Badge>
                  <span className="text-slate-500 text-sm">{endpoint.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 font-mono">
                  {endpoint.path}
                </h3>
                <p className="text-slate-600 text-sm">{endpoint.description}</p>
              </CardHeader>
              
              <CardContent className="p-6 bg-slate-50">
                <div className="font-mono text-sm">
                  {endpoint.response && (
                    <>
                      <div className="text-slate-600 mb-2">Response:</div>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                        <code>{endpoint.response}</code>
                      </pre>
                    </>
                  )}
                  {endpoint.request && (
                    <>
                      <div className="text-slate-600 mb-2">Request Body:</div>
                      <pre className="bg-slate-900 text-blue-400 p-3 rounded-lg overflow-x-auto">
                        <code>{endpoint.request}</code>
                      </pre>
                    </>
                  )}
                  {endpoint.example && (
                    <>
                      <div className="text-slate-600 mb-2">Example:</div>
                      <pre className="bg-slate-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                        <code>{endpoint.example}</code>
                      </pre>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
            <Book className="w-4 h-4 mr-2" />
            View Full API Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}
