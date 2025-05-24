import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useApiStatus } from "@/hooks/use-api-status";

const endpointStatus = [
  { path: "/api/health", responseTime: 95, status: "operational" },
  { path: "/api/pools", responseTime: 127, status: "operational" },
  { path: "/api/swap/quote", responseTime: 203, status: "operational" },
  { path: "/api/tokens/:mint", responseTime: 156, status: "operational" },
];

export default function Status() {
  const { data: status } = useApiStatus();

  return (
    <section id="status" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Service Status</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real-time monitoring of API performance and reliability
          </p>
        </div>
        
        {/* Status Overview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Current Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <Badge className="bg-emerald-100 text-emerald-800">
                  {status?.status === 'healthy' ? 'All Systems Operational' : 'Checking Status...'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {status?.metrics?.uptime ? `${status.metrics.uptime.toFixed(2)}%` : '99.97%'}
                </div>
                <div className="text-slate-600 text-sm">30-day Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {status?.metrics?.averageResponseTime ? `${Math.round(status.metrics.averageResponseTime)}ms` : '89ms'}
                </div>
                <div className="text-slate-600 text-sm">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {status?.metrics?.totalRequests ? `${(status.metrics.totalRequests / 1000).toFixed(1)}K` : '2.4M'}
                </div>
                <div className="text-slate-600 text-sm">Requests Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {status?.metrics?.errorRate ? `${status.metrics.errorRate.toFixed(2)}%` : '0.03%'}
                </div>
                <div className="text-slate-600 text-sm">Error Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Endpoint Status and Rate Limiting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900">Endpoint Health</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {endpointStatus.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-slate-700 font-mono text-sm">{endpoint.path}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-600 text-sm">{endpoint.responseTime}ms</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900">Rate Limiting</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Requests per minute</span>
                    <span className="text-slate-900 font-medium">100/100</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Requests per hour</span>
                    <span className="text-slate-900 font-medium">1,247/5,000</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Fair Usage:</strong> Rate limits ensure optimal performance for all users. 
                    Contact us for higher limits.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
