import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Creator from "@/components/sections/creator";
import Gallery from "@/components/sections/gallery";
import Tools from "@/components/sections/tools";
import Download from "@/components/sections/download";
import Footer from "@/components/sections/footer";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation isScrolled={isScrolled} />
      <Hero />
      <Features />
      <Creator />
      <Gallery />
      <Tools />
      <Download />
      <Footer />
    </div>
  );
}
