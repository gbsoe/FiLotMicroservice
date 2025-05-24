import { Card, CardContent } from "@/components/ui/card";
import { 
  Key, 
  ArrowRightLeft, 
  Database, 
  Coins, 
  Code, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Key,
    title: "No Authentication",
    description: "Start using immediately without API keys, registration, or authentication. Perfect for rapid prototyping and development.",
    iconBg: "bg-indigo-500",
  },
  {
    icon: ArrowRightLeft,
    title: "Swap Calculations",
    description: "Get real-time swap quotes, price impact calculations, and optimal routing for token exchanges on Raydium.",
    iconBg: "bg-emerald-500",
  },
  {
    icon: Database,
    title: "Pool Data",
    description: "Access comprehensive liquidity pool information, including TVL, volume, and real-time pool statistics.",
    iconBg: "bg-amber-500",
  },
  {
    icon: Coins,
    title: "Token Information",
    description: "Retrieve detailed token metadata, account balances, and parse token account data effortlessly.",
    iconBg: "bg-blue-500",
  },
  {
    icon: Code,
    title: "Transaction Building",
    description: "Generate transaction instructions for swaps, liquidity provision, and other Raydium operations.",
    iconBg: "bg-purple-500",
  },
  {
    icon: Shield,
    title: "Rate Limited",
    description: "Built-in rate limiting ensures fair usage while maintaining high availability for all users.",
    iconBg: "bg-red-500",
  },
];

export default function Features() {
  return (
    <section id="overview" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Core Features</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to integrate Raydium's DeFi capabilities into your application
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-50 hover:bg-slate-100 transition-colors border-0">
              <CardContent className="p-8">
                <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
