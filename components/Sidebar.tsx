import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  menuItems: { name: string; key: string; icon: React.ElementType }[];
}

export default function Sidebar({ isOpen, toggleSidebar, activePage, setActivePage, menuItems }: SidebarProps) {
  return (
    <div className={`h-full transition-all ${isOpen ? "w-64" : "w-16"} bg-gray-900 text-white flex flex-col`}>
      <Button variant="ghost" className="m-2" onClick={toggleSidebar}>
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.key}
            className={`w-full flex gap-2 px-4 py-2 ${activePage === item.key ? "bg-gray-700" : ""}`}
            onClick={() => setActivePage(item.key)}
          >
            <item.icon />
            {isOpen && <span>{item.name}</span>}
          </Button>
        ))}
      </nav>
    </div>
  );
}
