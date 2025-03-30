"use client"
import React, { useState } from "react"
import { BookingHistory } from "@/components/dashboard-user/BookingHistory";
import { Sidebar } from "@/components/dashboard-user/Sidebar";
import { Profile } from "@/components/dashboard-user/Profile";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<'profile' | 'booking-history'>('profile')

  return (
    <div className="flex h-screen container mx-auto px-4 py-8">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 overflow-auto p-8">
        {currentView === 'profile' && (
          <Profile />
        )}

        {currentView === 'booking-history' && (
          <BookingHistory />
        )}
      </div>
    </div>
  )
}