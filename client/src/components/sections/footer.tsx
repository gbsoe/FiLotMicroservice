import { ArrowRightLeft } from "lucide-react";
import { SiGithub, SiX, SiDiscord } from "react-icons/si";

const footerLinks = {
  resources: [
    { name: "Documentation", href: "#endpoints" },
    { name: "API Reference", href: "#endpoints" },
    { name: "Code Examples", href: "#examples" },
    { name: "SDK Guide", href: "#examples" },
  ],
  community: [
    { name: "GitHub Issues", href: "#" },
    { name: "Discord Support", href: "#" },
    { name: "Status Page", href: "#status" },
    { name: "Changelog", href: "#" },
  ],
};

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ArrowRightLeft className="text-white w-4 h-4" />
              </div>
              <h3 className="text-xl font-semibold">FiLotMicroservice</h3>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Professional-grade microservice API for precision investing. 
              Built with Node.js and Raydium SDK v2 for informed trading decisions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <SiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <SiX className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <SiDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-slate-400">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 FiLotMicroservice. Precision Investing API.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy
            </button>
            <button className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms
            </button>
            <button 
              onClick={() => scrollToSection('#status')}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Status
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
