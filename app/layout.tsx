import type { Metadata } from "next";

import "./globals.css";
import Providers from "./components/providers/providers";
import { heebo } from "@/lib/font";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Galaxy Booking",
  description: "The best booking site in the world!",
  icons: {
    icon: [
      {
        url: "/Images/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heebo.className} antialiased bg-black text-white`}>
        <Toaster />
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
