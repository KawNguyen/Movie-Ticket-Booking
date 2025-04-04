import React from "react";
import { LayoutDashboard } from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeTab, setActiveTab }) => {
  return (
    <nav className="min-h-screen w-52 p-4 border-x border-dotted">
      <div className="flex items-center gap-2 p-2">
        <LayoutDashboard size={20} />
        <span className="text-lg font-semibold">Dashboard</span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {navItems?.map((item, index) => (
          <div
            key={item.name + index}
            className={`w-full p-2 rounded-md cursor-pointer flex items-center gap-2
              ${activeTab === item.name ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}
            onClick={() => setActiveTab(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
