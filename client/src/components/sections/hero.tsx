import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Rocket, Github } from "lucide-react";
import { useApiStatus } from "@/hooks/use-api-status";

export default function Hero() {
  const { data: status } = useApiStatus();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge 
            variant="secondary" 
            className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-6"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            No API Key Required • Free Forever
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Raydium SDK v2
            <span className="text-indigo-500 block">Microservice API</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Access Raydium's powerful DeFi capabilities through our RESTful API. 
            Built with Node.js and Raydium SDK v2, providing seamless access to liquidity pools, 
            swap calculations, and token data without authentication barriers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg"
              onClick={() => scrollToSection('examples')}
              className="bg-indigo-500 text-white hover:bg-indigo-600 px-8 py-4 text-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('endpoints')}
              className="px-8 py-4 text-lg"
            >
              <Github className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {status?.metrics?.uptime ? `${status.metrics.uptime.toFixed(1)}%` : '99.9%'}
                </div>
                <div className="text-slate-600">Uptime</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {status?.metrics?.averageResponseTime ? `${Math.round(status.metrics.averageResponseTime)}ms` : '<100ms'}
                </div>
                <div className="text-slate-600">Response Time</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-slate-900 mb-2">8+</div>
                <div className="text-slate-600">API Endpoints</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
