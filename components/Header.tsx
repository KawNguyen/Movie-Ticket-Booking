"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  console.log(pathname);

  return (
    <header className="h-20 flex items-center">
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
            <Search className="text-bunker-600 hover:text-white duration-300 cursoir-pointer" />
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
