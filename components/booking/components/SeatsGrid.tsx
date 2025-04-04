import { Armchair } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SeatsGridProps {
  seats: Seat[];
  selectedSeats: string[];
  pendingSeats: string[];
  onSeatSelect: (seat: Seat) => void;
  ROWS: readonly string[];
  COLUMNS: number[];
}

export function SeatsGrid({
  seats,
  selectedSeats,
  pendingSeats,
  onSeatSelect,
  ROWS,
  COLUMNS,
}: SeatsGridProps) {
  return (
    <div className="grid grid-cols-8 gap-2 max-w-2xl w-full">
      {ROWS.map((row) =>
        COLUMNS.map((seatNumber) => {
          const seat = seats.find(
            (s) => s.row === row && s.number === seatNumber,
          );
          const seatId = seat ? `${row}${seatNumber}` : "";

          return (
            <div
              key={seatId}
              onClick={() => seat && !seat.isBooked && onSeatSelect(seat)}
              className={`
                flex flex-col items-center gap-1 transition-all duration-200
                ${!seat ? "invisible" : ""}
                ${
                  seat && !seat.isBooked
                    ? "cursor-pointer hover:text-green-500"
                    : "cursor-not-allowed"
                }
              `}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Armchair
                        size={36}
                        className={`
                          ${
                            seat?.isBooked
                              ? "text-red-500"
                              : selectedSeats.includes(seatId)
                                ? "text-green-500"
                                : pendingSeats.includes(seatId)
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                          }
                          transition-colors duration-200
                        `}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{seat ? `Seat ${seatId}` : ""}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs text-gray-400">{seatId}</span>
            </div>
          );
        }),
      )}
    </div>
  );
}
