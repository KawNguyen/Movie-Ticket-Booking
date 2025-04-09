"use client";

import MovieManagement from "@/components/dashboard-admin/MovieManagement";
import RoomManagement from "@/components/dashboard-admin/RoomManagement";
import ShowTimeManagement from "@/components/dashboard-admin/ShowTimeManagement";
import Sidebar from "@/components/Sidebar";
import { CalendarCheck, Film, Home } from "lucide-react";
import { useState } from "react";

const sidebarItems = [
  { name: "Movie", icon: <Film size={18} /> },
  { name: "Room", icon: <Home size={18} /> },
  { name: "Showtime", icon: <CalendarCheck size={18} /> },
];

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState("Movie");
  return (
    <main className="container flex w-full">
      <Sidebar
        urlMother="dashboard"
        navItems={sidebarItems}
        setActiveTab={setCurrentTab}
        activeTab={currentTab}
      />
      {currentTab === "Movie" && <MovieManagement />}
      {currentTab === "Room" && <RoomManagement />}
      {currentTab === "Showtime" && <ShowTimeManagement />}
    </main>
  );
};

export default Dashboard;
