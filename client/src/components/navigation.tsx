import { useState } from "react";
import { Menu, X, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  isScrolled: boolean;
}

export default function Navigation({ isScrolled }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#gallery", label: "Gallery" },
    { href: "#tools", label: "Tools" },
    { href: "#download", label: "Download" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "glassmorphism bg-slate-900/95" : "glassmorphism"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/limitless-logo.png" alt="Limitless Designs" className="h-10 w-auto" />
            <div>
              <h1 className="font-pixelbasel font-bold text-xl bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Summit</h1>
              <p className="text-xs text-slate-400">Limitless Designs</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="hover:text-teal-400 transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900 border-slate-800">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-lg hover:text-teal-400 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
