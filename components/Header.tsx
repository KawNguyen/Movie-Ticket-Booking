"use client";

import { cn } from "@/lib/utils";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const routes = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Showtimes",
    href: "/showtimes",
  },
  {
    name: "Our Theatre",
    href: "/our-theatre",
  },
  {
    name: "Store",
    href: "/store",
  },
  {
    name: "About Us",
    href: "/about-us",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Sign In",
    href: "/sign-in",
  },
];

const Header = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="h-20 flex items-center bg-black text-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-4xl font-bold">
          LOGO
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className={cn(
                "hover:text-brand-300 duration-300",
                route.href === pathname ? "text-brand-300" : "text-gray-400"
              )}
            >
              {route.name}
            </Link>
          ))}
          <Search className="text-gray-400 hover:text-brand-300 duration-300 cursor-pointer" />
          <Button className="bg-brand-800 hover:bg-brand-700 text-white">
            Join
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-400 hover:text-white duration-300"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-3/4 h-full bg-black z-50 flex flex-col p-6 gap-4">
          <button
            className="self-end text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className={cn(
                "hover:text-brand-300 text-lg duration-300",
                route.href === pathname ? "text-brand-300" : "text-gray-400"
              )}
              onClick={toggleSidebar} // Close sidebar when a link is clicked
            >
              {route.name}
            </Link>
          ))}
          <Search className="text-gray-400 hover:text-brand-300 duration-300 cursor-pointer" />
          <Button className="bg-brand-800 hover:bg-brand-700 text-white">
            Join
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
