import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ArrowRightLeft, Play, BookOpen } from "lucide-react";
import { Link } from "wouter";

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
          <Link to="/">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">FiLotMicroservice</h1>
                <p className="text-xs text-slate-500">Precision Investing</p>
              </div>
            </div>
          </Link>
          
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

            <Link to="/docs">
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                <BookOpen className="w-4 h-4 mr-2" />
                API Docs
              </Button>
            </Link>
          </nav>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/docs">
                  <Button className="bg-blue-500 text-white hover:bg-blue-600 justify-start w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
