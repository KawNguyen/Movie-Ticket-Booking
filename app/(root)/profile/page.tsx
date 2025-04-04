"use client";

import React, { useState } from "react";
import { BookingHistory } from "@/components/profile/BookingHistory";
import { Sidebar } from "@/components/profile/Sidebar";
import { Profile } from "@/components/profile/Profile";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<"profile" | "booking-history">(
    "profile",
  );
  const { data: session } = useSession();

  return (
    <div className="flex h-screen container mx-auto px-4 py-8">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 overflow-auto p-8">
        {currentView === "profile" && session?.user && (
          <Profile user={session.user} />
        )}

        {currentView === "booking-history" && <BookingHistory />}
      </div>
    </div>
  );
}
