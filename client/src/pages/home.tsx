import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Endpoints from "@/components/sections/endpoints";
import Examples from "@/components/sections/examples";
import Status from "@/components/sections/status";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <Hero />
      <Features />
      <Endpoints />
      <Examples />
      <Status />
      <Footer />
    </div>
  );
}
