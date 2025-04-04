import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BookingDetailsProps {
  selectedSeats: string[];
  selectedShowTime: Showtime | null;
  onBookTickets: () => void;
}

export function BookingDetails({
  selectedSeats,
  selectedShowTime,
  onBookTickets,
}: BookingDetailsProps) {
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-white font-semibold">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seatId) => (
                <Badge
                  key={seatId}
                  variant="outline"
                  className=" text-white border-brand/20"
                >
                  {seatId}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Total Price</p>
            <Separator className="my-2" />
            <p className="text-2xl font-bold text-white">
              $
              {(selectedSeats.length * (selectedShowTime?.price || 0)).toFixed(
                2,
              )}
            </p>
          </div>
        </div>
        <Button
          className="w-full bg-brand-500 hover:bg-brand-700 mt-4"
          size="lg"
          onClick={onBookTickets}
        >
          Book Tickets
        </Button>
      </CardContent>
    </Card>
  );
}
