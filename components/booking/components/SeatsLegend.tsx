import { Badge } from "@/components/ui/badge";

const LEGEND_ITEMS = [
  { color: "bg-gray-200", text: "Available" },
  { color: "bg-green-500", text: "Selected" },
  { color: "bg-red-500", text: "Booked" },
  { color: "bg-yellow-500/50", text: "Being Selected" },
];

export function SeatsLegend() {
  return (
    <div className="flex w-full  gap-3 sm:gap-6 mt-8">
      {LEGEND_ITEMS.map((item) => (
        <div
          key={item.text}
          className="flex flex-col items-center gap-2 w-[25%]"
        >
          <Badge variant="outline" className={`${item.color} w-6 h-6 p-0`} />
          <span className="text-gray-300 text-sm sm:text-base text-center">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}
