"use client"

import MovieManagement from "@/components/dashboard/MovieManagement"
import RoomManagement from "@/components/dashboard/RoomManagement"
import ShowTimeManagement from "@/components/dashboard/ShowTimeManagement"
import Sidebar from "@/components/Sidebar"
import { useState } from "react"

const sidebarItems = [
  { name: "Movie" },
  { name: "Room" },
  { name: "Showtime" },
]

const Page = () => {
  const [activeTab, setActiveTab] = useState("Movie")

  return (
    <main className="h-screen w-full">
      <div className="h-full w-full container flex gap-10">
        <Sidebar navItems={sidebarItems} setActiveTab={setActiveTab} />
        <div className="mt-4 w-full">
          {activeTab === "Movie" && <MovieManagement />}
          {activeTab === "Room" && <RoomManagement/>}
          {activeTab === "Showtime" && <ShowTimeManagement/>}
        </div>
      </div>
    </main>
  )
}

export default Page