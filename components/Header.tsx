"use client";

import { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { routes } from "@/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
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
        "h-16 flex items-center w-full z-50 fixed top-0 transform transition-all duration-300 ease-in-out px-4 lg:px-0 backdrop-blur-lg ",
        isScrolled ? "bg-black/80" : "",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <div className="relative w-[200px] h-[100px] md:w-[240px] lg:h-[120px]">
            <Image
              src="/Images/logo.png"
              alt="logo"
              fill
              className="object-contain"
              sizes="100%"
            />
          </div>
        </Link>
        <div className="hidden md:flex text-md items-center gap-4">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className={cn(
                "relative hover:text-brand-300 transition-colors duration-300 ",
                route.href === pathname ? "text-brand-500" : "text-bunker-600",
              )}
            >
              {route.name}
            </Link>
          ))}

          <SearchBar />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 rounded-full hover:bg-muted/0"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-500"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                {session.user.role === "ADMIN" ? (
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    Order History
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-500"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-brand-800 hover:bg-brand-700 text-white"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </div>
        <div className="block lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Menu
                size={32}
                className="transition-transform hover:scale-110 duration-300"
              />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 text-white flex flex-col h-full"
            >
              <SearchBar />
              <div className="flex flex-col space-y-4 mt-8 flex-1">
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
              <Button className="mt-4 bg-brand-800 hover:bg-brand-700">
                Join
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
