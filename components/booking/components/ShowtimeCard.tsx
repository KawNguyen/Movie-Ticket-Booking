import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function ShowtimeCardSkeleton() {
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-gray-700" />
          <Skeleton className="h-5 w-24 bg-gray-700" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 bg-gray-700" />
          <Skeleton className="h-5 w-16 bg-gray-700" />
        </div>
        <Skeleton className="h-5 w-20 bg-gray-700" />
      </div>
    </Card>
  );
}

interface ShowtimeCardProps {
  time: Showtime;
  isSelected: boolean;
  onSelect: (time: Showtime) => void;
}

export function ShowtimeCard({
  time,
  isSelected,
  onSelect,
}: ShowtimeCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <ShowtimeCardSkeleton />;
  }

  return (
    <Card
      key={time.id}
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-black border-2 border-brand"
          : "bg-black/40 hover:bg-black/60 border border-white/10"
      }`}
      onClick={() => onSelect(time)}
    >
      <div className="flex flex-col space-y-4 text-white">
        <div className="flex items-center gap-2">
          <Calendar
            className={`h-5 w-5 ${isSelected ? "text-brand" : "text-white/70"}`}
          />
          <span className="text-sm">
            {new Date(time.date).toLocaleDateString("en-GB")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock
            className={`h-5 w-5 ${isSelected ? "text-brand" : "text-white/70"}`}
          />
          <span className="text-sm">{time.time}</span>
        </div>
        <div className="text-sm text-white/70">Price: ${time.price}</div>
      </div>
    </Card>
  );
}
