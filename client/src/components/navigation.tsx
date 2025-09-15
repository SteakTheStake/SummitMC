import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  isScrolled: boolean;
}

export default function Navigation({ isScrolled }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/gallery", label: "Gallery" },
    { href: "/download", label: "Download" },
    { href: "/about", label: "About" }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "glassmorphism bg-slate-900/95" : "glassmorphism"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img src="/limitless-logo.png" alt="Limitless Designs" className="h-12 w-auto" />
              <div>
                <h1 className="font-pixelbasel font-bold text-xl bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Limitless Designs</h1>
                <p className="text-xs text-slate-400">Summit</p>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={`hover:text-pink-400 transition-colors duration-200 cursor-pointer ${
                  location === item.href ? 'text-pink-400' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
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
                  <Link key={item.href} href={item.href}>
                    <span
                      onClick={() => setIsOpen(false)}
                      className={`text-left text-lg hover:text-pink-400 transition-colors duration-200 block cursor-pointer ${
                        location === item.href ? 'text-pink-400' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
