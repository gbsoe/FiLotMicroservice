import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRightLeft, Play } from "lucide-react";

export default function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <ArrowRightLeft className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Raydium API</h1>
              <p className="text-xs text-slate-500">Free Microservice</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('overview')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Overview
            </button>
            <button 
              onClick={() => scrollToSection('endpoints')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Endpoints
            </button>
            <button 
              onClick={() => scrollToSection('examples')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Examples
            </button>
            <button 
              onClick={() => scrollToSection('status')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Status
            </button>
            <Button 
              onClick={() => scrollToSection('examples')}
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Try Now
            </Button>
          </nav>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <button 
                  onClick={() => scrollToSection('overview')}
                  className="text-left text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollToSection('endpoints')}
                  className="text-left text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Endpoints
                </button>
                <button 
                  onClick={() => scrollToSection('examples')}
                  className="text-left text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Examples
                </button>
                <button 
                  onClick={() => scrollToSection('status')}
                  className="text-left text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Status
                </button>
                <Button 
                  onClick={() => scrollToSection('examples')}
                  className="bg-indigo-500 text-white hover:bg-indigo-600 justify-start"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
