"use client";

import React, { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { ShowtimeCard } from "./components/ShowtimeCard";
import { SeatsGrid } from "./components/SeatsGrid";
import { SeatsLegend } from "./components/SeatsLegend";
import { BookingDetails } from "./components/BookingDetails";
import { getShowtimesByMovieId } from "@/lib/api/showtimes";
import { getSeatsByRoom } from "@/lib/api/seats";
import { getBookingSeatsByShowtime } from "@/lib/api/booking-seat";

const ROWS = ["A", "B", "C", "D", "E", "F"] as const;
const COLUMNS = Array.from({ length: 8 }, (_, i) => i + 1);

const Booking = ({ slug }: { slug: string }) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [showTimes, setShowTimes] = useState<Showtime[]>([]);
  const [selectedShowTime, setSelectedShowTime] = useState<Showtime | null>(
    null,
  );
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [pendingSeats, setPendingSeats] = useState<string[]>([]);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    const fetchShowTimes = async () => {
      if (slug) {
        try {
          const times = await getShowtimesByMovieId(slug);
          setShowTimes(times as Showtime[]);
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "Failed to load showtimes",
            variant: "destructive",
          });
        }
      }
    };
    fetchShowTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    socketRef.current = io({
      path: "/api/socket",
    });
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on(
      "seat-selected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          console.log(`Seat ${seatId} has been selected (showtime: ${showtimeId})`);
          setPendingSeats((prev) => [...new Set([...prev, seatId])]);
        }
      },
    );

    socketRef.current.on(
      "seat-unselected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          console.log(`Seat ${seatId} has been unselected`);
          setPendingSeats((prev) => prev.filter((id) => id !== seatId));
        }
      },
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedShowTime]);

  const handleShowtimeSelect = async (time: Showtime) => {
    setSelectedShowTime(time);
    setIsLoadingSeats(true);
    try {
      const [seatsData, bookingSeats] = await Promise.all([
        getSeatsByRoom(time.screeningRoomId, time.id),
        getBookingSeatsByShowtime(time.id),
      ]);

      const updatedSeats = seatsData.map((seat) => ({
        ...seat,
        isBooked: (bookingSeats as number[]).includes(seat.id),
      }));

      setSeats(updatedSeats);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load seats",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSeats(false);
    }
  };

  const handleSeatSelect = async (seat: Seat) => {
    const seatId = `${seat.row}${seat.number}`;
    const showtimeId = selectedShowTime?.id;

    if (!showtimeId || seat.bookingSeats?.some((bs) => bs.status === "BOOKED"))
      return;

    const isSelected = selectedSeats.includes(seatId);
    const newSelectedSeats = isSelected
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(newSelectedSeats);

    if (socketRef.current) {
      socketRef.current.emit(isSelected ? "unselect_seat" : "select_seat", {
        seatId,
        showtimeId,
      });
    }

    // Update ghế ngay (realtime feedback UI)
    const [unused, bookingSeats] = await Promise.all([
      // Remove unused console.log since the variable is used before declaration
      getSeatsByRoom(selectedShowTime.screeningRoomId, showtimeId),
      getBookingSeatsByShowtime(showtimeId),
    ]);

    console.log(unused);

    setSeats((prev) =>
      prev.map((s) => ({
        ...s,
        bookingSeats: (bookingSeats as BookingSeat[]).filter(
          (bs) =>
            bs.seatId === s.id &&
            (bs.status === "BOOKED" || bs.status === "PENDING"),
        ),
      })),
    );
  };

  const handleBookTickets = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please login to book tickets",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }
  
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showtimeId: selectedShowTime?.id,
          userId: session?.user?.id,
          totalPrice: selectedSeats.length * (selectedShowTime?.price || 0),
          status: "PENDING",
          bookingSeats: seats
            .filter((seat) =>
              selectedSeats.includes(`${seat.row}${seat.number}`),
            )
            .map((seat) => ({
              seatId: seat.id,
              showtimeId: selectedShowTime?.id,
            })),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create booking");
      }
  
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
  
      // Reset selection
      setSelectedSeats([]);
      handleShowtimeSelect(selectedShowTime!);
    } catch (error) {
      console.error("[BOOKING_ERROR]", error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    socketRef.current = io({
      path: "/api/socket",
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on(
      "seat_selected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          setPendingSeats((prev) => [...new Set([...prev, seatId])]);
        }
      },
    );

    socketRef.current.on(
      "seat_unselected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          setPendingSeats((prev) => prev.filter((id) => id !== seatId));
        }
      },
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedShowTime]);

  // Update the return statement to show both sections
  return (
    <div className="space-y-8">
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Select Showtime
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {showTimes.map((time) => (
            <ShowtimeCard
              key={time.id}
              time={time}
              isSelected={selectedShowTime?.id === time.id}
              onSelect={handleShowtimeSelect}
            />
          ))}
        </div>
      </section>

      {selectedShowTime && (
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Select Seats
          </h2>
          {isLoadingSeats ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-full bg-gray-700/50 p-8 rounded-lg text-center mb-12 border border-brand/20">
                  <p className="text-brand text-lg font-semibold">SCREEN</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <SeatsGrid
                    seats={seats}
                    selectedSeats={selectedSeats}
                    pendingSeats={pendingSeats}
                    onSeatSelect={handleSeatSelect}
                    ROWS={ROWS}
                    COLUMNS={COLUMNS}
                  />
                  <SeatsLegend />
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <BookingDetails
                  selectedSeats={selectedSeats}
                  selectedShowTime={selectedShowTime}
                  onBookTickets={handleBookTickets}
                />
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Booking;
