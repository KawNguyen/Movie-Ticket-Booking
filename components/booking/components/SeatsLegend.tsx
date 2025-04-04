import { Badge } from "@/components/ui/badge";

const LEGEND_ITEMS = [
  { color: "bg-gray-200", text: "Available" },
  { color: "bg-green-500", text: "Selected" },
  { color: "bg-red-500", text: "Booked" },
  { color: "bg-yellow-500/50", text: "Being Selected" },
];

export function SeatsLegend() {
  return (
    <div className="flex gap-6 mt-8">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.text} className="flex items-center gap-2">
          <Badge variant="outline" className={`${item.color} w-6 h-6 p-0`} />
          <span className="text-gray-300">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
