import { useState, useEffect, ReactNode } from "react";
import Navigation from "@/components/navigation";
import FooterSection from "@/components/sections/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation isScrolled={isScrolled} />
      {children}
      <FooterSection />
    </div>
  );
}