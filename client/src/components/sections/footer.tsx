import { ArrowRightLeft } from "lucide-react";
import { SiGithub, SiX, SiDiscord } from "react-icons/si";
import { Link } from "wouter";

const footerLinks = {
  resources: [
    { name: "API Documentation", href: "/docs" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  contact: [
    { name: "@Fi_lotbot", href: "https://t.me/Fi_lotbot" },
    { name: "support@filot.io", href: "mailto:support@filot.io" },
    { name: "Dubai International Financial Centre, Dubai, UAE", href: "#" },
  ],
  ecosystem: [
    { name: "FiLotSense", href: "https://filotsense.replit.app/" },
    { name: "LA! Token", href: "https://crazyrichla.replit.app/" },
    { name: "FiLotAnalytics", href: "https://filotanalytics.replit.app/" },
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
              FiLot microservice API for precision investing. 
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
                  <Link href={link.href}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-2 text-slate-400">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="hover:text-white transition-colors text-sm"
                    target={link.href.startsWith('http') ? "_blank" : "_self"}
                    rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">FiLot Ecosystem</h4>
            <ul className="space-y-2 text-slate-400">
              {footerLinks.ecosystem.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
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
            <Link to="/privacy">
              <span className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                Privacy
              </span>
            </Link>
            <Link to="/terms">
              <span className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                Terms
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
