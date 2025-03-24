"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { routes } from "@/constants";

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

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
        "h-20 flex items-center w-full fixed z-50 transition-colors duration-300",
        isScrolled ? "bg-black/80 fixed" : ""
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-4xl">
            LOGO
          </Link>

          <div className="text-md flex items-center gap-4">
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
            
            <Link href="/login" className="text-white">
              Login
            </Link>
            <Search className="text-bunker-600 hover:text-white duration-300 cursor-pointer" />
            <Button className="bg-brand-800 hover:bg-brand-700 text-white">
              Join
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
