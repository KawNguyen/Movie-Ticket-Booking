"use client"

import { CalendarCheck, Film, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import MovieManagement from "../dashboard-admin/MovieManagement";
import RoomManagement from "../dashboard-admin/RoomManagement";
import ShowTimeManagement from "../dashboard-admin/ShowTimeManagement";
import Sidebar from "../dashboard-admin/Sidebar";

const sidebarItems = [
  { name: "Movie", icon: <Film size={18} /> },
  { name: "Room", icon: <Home size={18} /> },
  { name: "Showtime", icon: <CalendarCheck size={18} /> },
];

const TemplateDashboard = () => {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'movie'

  const renderContent = () => {
    switch (currentTab) {
      case 'movie':
        return <MovieManagement />
      case 'room':
        return <RoomManagement />
      case 'showtime':
        return <ShowTimeManagement />
      default:
        return <MovieManagement />
    }
  }

  return (
    <div className="h-full w-full container flex gap-10">
      <Sidebar
        navItems={sidebarItems as NavItem[]}
      />
      <div className="my-4 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default TemplateDashboard;
