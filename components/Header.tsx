"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, User } from "lucide-react";
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
import logoImage from "@/public/Images/logo.webp";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

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
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Image
            src={logoImage}
            alt="logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
        </Link>
        <div className="hidden md:flex text-md items-center gap-4">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className={cn(
                "relative hover:text-brand-300 transition-colors duration-300 ",
                route.href === pathname ? "text-brand-500" : "text-bunker-600"
              )}
            >
              {route.name}
            </Link>
          ))}

          <SearchBar />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer flex items-center justify-center hover:border">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt="Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-white">
                    {session?.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border-none">
                <DropdownMenuItem
                  className="text-white"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem
                    className="text-white"
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
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
              Login In
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

              {session?.user ? (
                <div className="mb-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-3 w-full justify-start text-white px-2 py-1"
                      >
                        <Avatar className="h-8 w-8 cursor-pointer flex items-center justify-center hover:border">
                          <AvatarImage
                            src={session?.user?.image || undefined}
                            alt="Avatar"
                            className="object-cover"
                          />
                          <AvatarFallback className="text-white">
                            {session?.user?.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">
                            {session.user.name}
                          </span>
                          <span className="text-xs text-gray-400 truncate max-w-[150px]">
                            {session.user.email}
                          </span>
                        </div>
                        <ChevronDown
                          size={18}
                          className="ml-auto text-gray-300"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[260px] bg-black"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          router.push("/profile");
                          setIsSheetOpen(false);
                        }}
                        className="text-white"
                      >
                        Profile
                      </DropdownMenuItem>
                      {session.user.role === "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => {
                            router.push("/dashboard");
                            setIsSheetOpen(false);
                          }}
                          className="text-white"
                        >
                          Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
                          setIsSheetOpen(false);
                        }}
                        className="text-red-500"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  className="bg-brand-800 hover:bg-brand-700 text-white"
                  onClick={() => {
                    signIn();
                    setIsSheetOpen(false);
                  }}
                >
                  Login In
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
