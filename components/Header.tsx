"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { routes } from "@/constants";

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "h-16 flex items-center w-full z-50 fixed top-0 transform transition-all duration-300 ease-in-out px-4 lg:px-0 backdrop-blur-lg border-b border-dotted",
        isScrolled 
          ? "bg-black/70" 
          : "bg-transparent",
        isVisible 
          ? "translate-y-0" 
          : "-translate-y-full"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl md:text-4xl transition-transform hover:scale-105 duration-300">
          LOGO  
        </Link>

        <div className="hidden md:flex text-md items-center gap-4">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className={cn(
                "relative hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-white after:transition-all after:duration-300",
                route.href === pathname 
                  ? "text-white after:w-full" 
                  : "text-bunker-600 after:w-0 hover:after:w-full"
              )}
            >
              {route.name}
            </Link>
          ))}
          <Search className="text-bunker-600 hover:text-white duration-300 cursor-pointer" />
          <Button className="bg-brand-800 hover:bg-brand-700 text-white">Sign In</Button>
        </div>

        <div className="block lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Menu size={32} className="transition-transform hover:scale-110 duration-300" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 text-white flex flex-col">
              <Search className="mt-4 cursor-pointer transition-transform hover:scale-110 duration-300" />
              <div className="flex flex-col space-y-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.name}
                    href={route.href}
                    className="text-lg transform transition-all duration-300 hover:text-brand-500 hover:translate-x-2"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {route.name}
                  </Link>
                ))}
              </div>
              <Button className="mt-4 bg-brand-800 hover:bg-brand-700">Join</Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
