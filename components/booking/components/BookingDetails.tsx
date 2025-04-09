import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";

interface BookingDetailsProps {
  selectedSeats: string[];
  selectedShowTime: Showtime | null;
  onBookTickets: (paymentMethod: string) => void;
  onTimeout: () => void;
}

export function BookingDetails({
  selectedSeats,
  selectedShowTime,
  onBookTickets,
  onTimeout,
}: BookingDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30); // 5 minutes in seconds
  const { toast } = useToast();

  useEffect(() => {
    if (selectedSeats.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimeout();
            toast({
              title: "Time's up!",
              description: "Your seat selection has expired",
              variant: "destructive",
            });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedSeats, onTimeout, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBookClick = () => {
    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive",
      });
      return;
    }
    onBookTickets(paymentMethod);
  };

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          <span>Booking Summary</span>
          <span className="text-sm font-normal">
            Time remaining: {formatTime(timeLeft)}
          </span>
        </CardTitle>
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
