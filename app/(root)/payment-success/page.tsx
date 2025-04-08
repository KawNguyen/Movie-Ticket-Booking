"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PaymentSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const resultCode = searchParams?.get('resultCode');
    const bookingData = localStorage.getItem('selectedSeats');
    
    // Kiểm tra kết quả thanh toán từ MoMo
    if (resultCode !== '0') {
      toast({
        title: 'Thanh toán thất bại',
        description: 'Giao dịch đã bị hủy hoặc thất bại',
        variant: 'destructive',
      });
      
      const { movieId } = bookingData ? JSON.parse(bookingData) : { movieId: '' };
      
      // Countdown timer cho trường hợp thất bại
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Move navigation to useEffect cleanup
            setTimeout(() => router.push(`/booking/${movieId}`), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        // Add navigation here if needed
      };
    }

    if (!bookingData) return;

    const { seats, showtimeId } = JSON.parse(bookingData);

    const fetchSeats = async () => {
      try {
        const seatRes = await fetch(`/api/seats/${showtimeId}`, {
          headers: {
            'showtime-id': showtimeId.toString()
          }
        });
        if (!seatRes.ok) {
          throw new Error('Failed to fetch seats');
        }
        const seatData = await seatRes.json();

        const selectedSeatObjects = seatData.filter((seat: any) =>
          seats.includes(`${seat.row}${seat.number}`)
        );

        const bookingSeats = selectedSeatObjects.map((seat: any) => ({
          seatId: seat.id,
          showtimeId,
          status: "BOOKED",
        }));

        const res = await fetch('/api/bookings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            showtimeId,
            status: "BOOKED",
            bookingSeats,
          }),
        });

        if (!res.ok) {
          throw new Error('Booking failed');
        }

        toast({
          title: 'Success',
          description: 'Your booking is confirmed!',
        });

        localStorage.removeItem('selectedSeats');

        // Countdown timer cho trường hợp thành công
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push('/profile');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error('[BOOKING_AFTER_PAYMENT]', error);
        toast({
          title: 'Error',
          description: 'Failed to confirm booking after payment',
          variant: 'destructive',
        });
      }
    };

    fetchSeats();
  }, [router, searchParams, toast]); // Add all dependencies here

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-3xl font-bold text-white dark:text-white">
        {searchParams?.get('resultCode') === '0' ? '🎉 Thanh toán thành công!' : '❌ Thanh toán thất bại!'}
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {searchParams?.get('resultCode') === '0' 
          ? `Bạn sẽ được chuyển đến trang lịch sử đặt vé sau ${countdown} giây...`
          : `Bạn sẽ được chuyển đến trang đặt vé sau ${countdown} giây...`
        }
      </p>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
