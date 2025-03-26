"use client";

import { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";
import { routes } from "@/constants";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session?.user?.role);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`h-16 flex items-center w-full z-50 px-4 lg:px-0 ${isScrolled ? "bg-black/90 fixed" : ""}`}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl md:text-4xl">LOGO</Link>

        {/* Navigation */}
        <div className="hidden md:flex text-md items-center gap-4">
          {routes.map((route) => (
            <Link key={route.name} href={route.href} className={`hover:text-white duration-300 ${route.href === pathname ? "text-white" : "text-bunker-600"}`}>
              {route.name}
            </Link>
          ))}
          <Search className="text-bunker-600 hover:text-white duration-300 cursor-pointer" />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <Image
                    src={session.user.image || "/default-avatar.jpg"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-500"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                {session.user.role == "ADMIN" ? (
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                ):(
                  <DropdownMenuItem onClick={() => router.push("/orders")}>Order History</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-brand-800 hover:bg-brand-700 text-white" onClick={() => signIn()}>Sign In</Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild><Menu size={32} /></SheetTrigger>
            <SheetContent side="right" className="bg-black text-white flex flex-col">
              <Search className="mt-4 cursor-pointer" />
              {routes.map((route) => (
                <Link key={route.name} href={route.href} className="text-lg hover:text-brand-500" onClick={() => setIsSheetOpen(false)}>
                  {route.name}
                </Link>
              ))}
              {session?.user ? (
                <>
                  <div className="flex items-center gap-2 mt-4">
                    <Image
                      src={session.user.image || "/default-avatar.jpg"}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border border-gray-500"
                    />
                    <span>{session.user.name}</span>
                  </div>
                  <Button variant="ghost" onClick={() => router.push("/profile")}>Profile</Button>
                  <Button variant="ghost" onClick={() => router.push("/orders")}>Order History</Button>
                  <Button className="bg-red-600 hover:bg-red-500" onClick={() => signOut()}>Sign Out</Button>
                </>
              ) : (
                <Button className="bg-brand-800 hover:bg-brand-700" onClick={() => signIn()}>Sign In</Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
