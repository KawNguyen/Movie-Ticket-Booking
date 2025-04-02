import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface SidebarProps {
  currentView: "profile" | "booking-history";
  setCurrentView: (view: "profile" | "booking-history") => void;
}

export const Sidebar = ({ currentView, setCurrentView }: SidebarProps) => {
  return (
    <div className="w-64 border-r p-6 flex flex-col  text-white">
      <nav className="space-y-2">
        <Button
          variant={currentView === "profile" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setCurrentView("profile")}
        >
          Profile
        </Button>

        <Button
          variant={currentView === "booking-history" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setCurrentView("booking-history")}
        >
          Booking History
        </Button>

        <Button
          className="w-full justify-start bg-transparent hover:bg-white hover:text-black border-none"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </Button>
      </nav>
    </div>
  );
};
