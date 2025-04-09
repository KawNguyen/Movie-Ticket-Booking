"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingHistory } from "@/components/profile/BookingHistory";
import { Profile } from "@/components/profile/Profile";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { History, User, LucideSidebarOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
  { name: "Profile", icon: <User size={18} /> },
  { name: "Booking History", icon: <History size={18} /> },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState("Profile");
  const { data: session } = useSession();

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "Profile") {
      setCurrentView("Profile");
    } else if (tab === "Booking History") {
      setCurrentView("Booking History");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen container mx-auto px-4">
      {/* Mobile Menu */}
      <div className="lg:hidden flex items-center py-4">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <LucideSidebarOpen size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-black">
            <Sidebar
              urlMother="profile"
              navItems={sidebarItems}
              activeTab={currentView}
              setActiveTab={setCurrentView}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          urlMother="profile"
          navItems={sidebarItems}
          activeTab={currentView}
          setActiveTab={setCurrentView}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {currentView === "Profile" && session?.user && (
          <Profile user={session?.user} />
        )}
        {currentView === "Booking History" && (
          <BookingHistory session={session} />
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
