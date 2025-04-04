"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Armchair } from "lucide-react";
import { getShowtimesByMovieId } from "@/lib/api/showtimes";
import { getSeatsByRoom } from "@/lib/api/seats";
import { useToast } from "@/hooks/use-toast";
import { getBookingSeatsByShowtime } from "@/lib/api/booking-seat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { io } from "socket.io-client";

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
          console.log(`Ghế ${seatId} đã được chọn (showtime: ${showtimeId})`);
          setPendingSeats((prev) => [...new Set([...prev, seatId])]);
        }
      },
    );

    socketRef.current.on(
      "seat-unselected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          console.log(`Ghế ${seatId} đã được bỏ chọn`);
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
            <Card
              key={time.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedShowTime?.id === time.id
                  ? "bg-black border-2 border-brand"
                  : "bg-black/40 hover:bg-black/60 border border-white/10"
              }`}
              onClick={() => handleShowtimeSelect(time)}
            >
              <div className="flex flex-col space-y-4 text-white">
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`h-5 w-5 ${
                      selectedShowTime?.id === time.id
                        ? "text-brand"
                        : "text-white/70"
                    }`}
                  />
                  <span className="text-sm">
                    {new Date(time.date).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className={`h-5 w-5 ${
                      selectedShowTime?.id === time.id
                        ? "text-brand"
                        : "text-white/70"
                    }`}
                  />
                  <span className="text-sm">{time.time}</span>
                </div>
                <div className="text-sm text-white/70">
                  Price: ${time.price}
                </div>
              </div>
            </Card>
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
                  {/* Seats Grid */}
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
                            onClick={() =>
                              seat && !seat.isBooked && handleSeatSelect(seat)
                            }
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

                                    {/* <Armchair size={36} className={`transition-colors duration-200 ${seat?.isBooked ? '' : 'hover:text-green-500'} ${!seat ? 'invisible' : seat.isBooked ? 'text-red-500' : selectedSeats.includes(seatId) ? 'text-green-500' : 'text-gray-400'}`} /> */}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{seat ? `Seat ${seatId}` : ""}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-xs text-gray-400">
                              {seatId}
                            </span>
                          </div>
                        );
                      }),
                    )}
                  </div>

                  {/* Legend continues... */}
                  <div className="flex gap-6 mt-8">
                    {[
                      { color: "bg-gray-200", text: "Available" },
                      { color: "bg-green-500", text: "Selected" },
                      { color: "bg-red-500", text: "Booked" },
                      { color: "bg-yellow-500/50", text: "Being Selected" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${item.color} w-6 h-6 p-0`}
                        />
                        <span className="text-gray-300">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          Selected Seats:
                        </h3>
                        <div className="flex gap-2">
                          {selectedSeats.map((seatId) => (
                            <span
                              key={seatId}
                              className="bg-brand/20 text-brand px-2 py-1 rounded"
                            >
                              {seatId}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 mb-2">Total Price</p>
                        <p className="text-2xl font-bold text-white">
                          $
                          {(
                            selectedSeats.length *
                            (selectedShowTime?.price || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-brand hover:bg-brand/90"
                      onClick={async () => {
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
                          // Create booking
                          const response = await fetch("/api/bookings", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              showtimeId: selectedShowTime?.id,
                              userId: session?.user?.id,
                              totalPrice:
                                selectedSeats.length *
                                (selectedShowTime?.price || 0),
                              status: "PENDING",
                              bookingSeats: seats
                                .filter((seat) =>
                                  selectedSeats.includes(
                                    `${seat.row}${seat.number}`,
                                  ),
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
                      }}
                    >
                      Book Tickets
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Booking;
