"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Film, Users, Ticket } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const menuItems = [
  { name: "Dashboard", key: "dashboard", icon: BarChart },
  { name: "Quản lý phim", key: "movies", icon: Film },
  { name: "Lịch chiếu", key: "schedule", icon: Ticket },
  { name: "Vé đã bán", key: "tickets", icon: Users },
];

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
        menuItems={menuItems}
      />

      <div className="flex-1 p-6">
        {activePage === "dashboard" && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Doanh thu hôm nay" value="10,000,000đ" icon={BarChart} color="text-green-500" />
            <StatCard title="Vé đã bán" value="320 vé" icon={Ticket} color="text-blue-500" />
            <StatCard title="Phim đang chiếu" value="12 phim" icon={Film} color="text-purple-500" />
            <StatCard title="Khách hàng" value="1,200" icon={Users} color="text-orange-500" />
          </div>
        )}

        {activePage === "movies" && <div>📽️ Quản lý phim</div>}
        {activePage === "schedule" && <div>📅 Lịch chiếu</div>}
        {activePage === "tickets" && <div>🎟️ Vé đã bán</div>}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <Icon size={28} className={color} />
      </CardContent>
    </Card>
  );
}
