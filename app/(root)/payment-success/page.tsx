"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {data: session} = useSession();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const resultCode = searchParams?.get("resultCode");
    const bookingData = localStorage.getItem("selectedSeats");

    if (resultCode !== "0") {
      toast({
        title: "Payment Failed",
        description: "The transaction was cancelled or failed",
        variant: "destructive",
      });

      const { movieId } = bookingData
        ? JSON.parse(bookingData)
        : { movieId: "" };

      // Countdown timer for failure case
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
            "showtime-id": showtimeId.toString(),
          },
        });
        if (!seatRes.ok) {
          throw new Error("Failed to fetch seats");
        }
        const seatData = await seatRes.json();

        const selectedSeatObjects = seatData.filter((seat: any) =>
          seats.includes(`${seat.row}${seat.number}`),
        );

        const bookingSeats = selectedSeatObjects.map((seat: any) => ({
          seatId: seat.id,
          showtimeId,
          status: "BOOKED",
        }));

        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            showtimeId,
            status: "BOOKED",
            bookingSeats,
          }),
        });

        if (!res.ok) {
          throw new Error("Booking failed");
        }

        toast({
          title: "Success",
          description: "Your booking is confirmed!",
          variant: "destructive",
        });

        localStorage.removeItem("selectedSeats");

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push("/profile?tab=Booking%20History");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error("[BOOKING_AFTER_PAYMENT]", error);
        toast({
          title: "Error",
          description: "Failed to confirm booking after payment",
          variant: "destructive",
        });
      }
    };

    fetchSeats();
  }, [router, searchParams, toast, session?.user?.id]); // Added session?.user?.id

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-3xl font-bold text-white dark:text-white">
        {searchParams?.get("resultCode") === "0"
          ? "🎉 Payment Successful!"
          : "❌ Payment Failed!"}
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        {searchParams?.get("resultCode") === "0"
          ? `You will be redirected to booking history in ${countdown} seconds...`
          : `You will be redirected to booking page in ${countdown} seconds...`}
      </p>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Processing payment...
          </h1>
          <p className="mt-4 text-gray-400">
            Please wait while we confirm your payment
          </p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
