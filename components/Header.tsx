"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { routes } from "@/constants";
import SearchBar from "./SearchBar";

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "h-16 flex items-center w-full z-50 transition-colors duration-300 px-4 lg:px-0 overflow-visible",
        isScrolled ? "bg-black/80 fixed" : ""
      )}
    >

      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl md:text-4xl">
          LOGO
        </Link>

        <div className="hidden md:flex text-md items-center gap-4">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className={cn(
                "hover:text-white duration-300",
                route.href === pathname ? "text-white" : "text-bunker-600"
              )}
            >
              {route.name}
            </Link>
          ))}
          {/* <Search className="text-bunker-600 hover:text-white duration-300 cursor-pointer" /> */}
          <SearchBar />
          <Button className="bg-brand-800 hover:bg-brand-700 text-white">Sign In</Button>
        </div>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Menu size={32} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white flex flex-col">
              <Search className="mt-4 cursor-pointer" />
              <div className="flex flex-col">
                {routes.map((route) => (
                  <Link
                    key={route.name}
                    href={route.href}
                    className="text-lg hover:text-brand-500"
                    onClick={() => setIsSheetOpen(false)} // Đóng sheet khi click vào route
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
