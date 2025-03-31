"use client"

import MovieManagement from "@/components/dashboard/MovieManagement"
import RoomManagement from "@/components/dashboard/RoomManagement"
import ShowTimeManagement from "@/components/dashboard/ShowTimeManagement"
import Sidebar from "@/components/Sidebar"
import { CalendarCheck, Film, Home } from "lucide-react"
import { useState } from "react"

const sidebarItems = [
  { name: "Movie", icon: <Film size={18}/> },
  { name: "Room", icon: <Home size={18}/> },
  { name: "Showtime", icon: <CalendarCheck size={18}/> },
]

const Page = () => {
  const [activeTab, setActiveTab] = useState("Movie")

  return (
    <main className="h-full w-full">
      <div className="h-full w-full container flex gap-10">
        <Sidebar navItems={sidebarItems as NavItem[]} setActiveTab={setActiveTab} />
        <div className="my-4 w-full h-full">
          {activeTab === "Movie" && <MovieManagement />}
          {activeTab === "Room" && <RoomManagement/>}
          {activeTab === "Showtime" && <ShowTimeManagement/>}
        </div>
      </div>
    </main>
  )
}

export default Page