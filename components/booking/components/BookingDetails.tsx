import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface BookingDetailsProps {
  selectedSeats: string[];
  selectedShowTime: Showtime | null;
  onBookTickets: (paymentMethod: string) => void;  // Updated to accept paymentMethod
  onTimeout: (seatId: string) => void;
}

export function BookingDetails({
  selectedSeats,
  selectedShowTime,
  onBookTickets,
  onTimeout,
}: BookingDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const { toast } = useToast();

  const handleBookClick = () => {
    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }
    onBookTickets(paymentMethod);
  };
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    selectedSeats.forEach((seatId) => {
      if (!timeLeft[seatId]) {
        setTimeLeft((prev) => ({ ...prev, [seatId]: 600 })); 
      }
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = { ...prev };
        let hasChanges = false;

        selectedSeats.forEach((seatId) => {
          if (newTimeLeft[seatId] > 0) {
            newTimeLeft[seatId]--;
            if (newTimeLeft[seatId] === 0) {
              onTimeout(seatId);
            }
            hasChanges = true;
          }
        });

        return hasChanges ? newTimeLeft : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats, onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
                <div key={seatId} className="flex flex-col items-center">
                  <Badge
                    variant="outline"
                    className="text-white border-brand/20"
                  >
                    {seatId}
                  </Badge>
                  <span className={`text-xs mt-1 ${timeLeft[seatId] < 60 ? 'text-red-400' : 'text-gray-300'}`}>
                    {formatTime(timeLeft[seatId] || 0)}
                  </span>
                </div>
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
        <div className="space-y-4">
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-full text-white">
              <SelectValue placeholder="Chọn phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qr">Quét Mã QR</SelectItem>
              <SelectItem value="napas">Thẻ Napas nội địa</SelectItem>
              <SelectItem value="visa">Thẻ Visa quốc tế</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="w-full bg-brand-500 hover:bg-brand-700"
            size="lg"
            onClick={handleBookClick}
          >
            Book Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
