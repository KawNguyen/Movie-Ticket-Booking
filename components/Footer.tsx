"use client"

import Link from "next/link";
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { routes } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer className="bg-black text-white py-10 border-t border-dotted">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
        <div>
          <h2 className="text-3xl font-bold">LOGO</h2>
          <p className="text-gray-400 mt-4">
            Experience top-quality movies with immersive sound. Book your
            tickets now for an unforgettable cinema experience!
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2 flex flex-col">
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
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MapPin size={20} className="text-white" />
              <span>123 ABC Street, New York, NY</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={20} className="text-white" />
              <span>+1 234 567 890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={20} className="text-white" />
              <span>support@cinema.com</span>
            </li>
          </ul>

          <div className="flex space-x-4 mt-4">
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <Facebook size={24} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <Twitter size={24} />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <Youtube size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Cinema. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
