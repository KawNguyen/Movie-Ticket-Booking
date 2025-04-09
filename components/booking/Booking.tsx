"use client";

import { useEffect, useState, useRef } from "react";
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
  interface Seat {
    id: number;
    row: string;
    number: number;
    isBooked?: boolean;
    bookingSeats: {
      id: number;
      seatId?: number;
      showtimeId?: number;
      status: "AVAILABLE" | "PENDING" | "BOOKED";
      userId: string;
      bookingId?: number;
    }[];
  }
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [pendingSeats, setPendingSeats] = useState<string[]>([]);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Kiểm tra và khôi phục trạng thái đặt vé từ localStorage
    const savedBooking = localStorage.getItem('selectedSeats');
    if (savedBooking) {
      try {
        const { seats, showtimeId, expiryTime } = JSON.parse(savedBooking);
        if (Date.now() < expiryTime) {
          // Nếu chưa hết hạn, khôi phục trạng thái đặt vé
          const showtime = showTimes.find(st => st.id === showtimeId);
          if (showtime) {
            setSelectedShowTime(showtime);
            setSelectedSeats(seats);
          }
        }
        // Xóa thông tin đã lưu
        localStorage.removeItem('selectedSeats');
      } catch (error) {
        console.error('Error restoring booking state:', error);
      }
    }

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
    // Reset states when showtime changes
    setSelectedSeats([]);
    setPendingSeats([]);

    const socket = io("https://server-socket-production-8dee.up.railway.app", {
      transports: ["websocket"],
    });
    // socketRef.current.on("connect", () => {
    //   console.log("Socket connected:", socketRef.current?.id);
    // });
    socketRef.current = socket;
    socketRef.current.on(
      "seat_selected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          console.log(
            `Seat ${seatId} has been selected (showtime: ${showtimeId})`,
          );
          setPendingSeats((prev) => [...new Set([...prev, seatId])]);
        }
      },
    );

    socketRef.current.on(
      "seat_unselected",
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
    setPendingSeats([]);
    setIsLoadingSeats(true);
    try {
      const [seatsData, bookingSeats] = (await Promise.all([
        getSeatsByRoom(time.screeningRoomId, time.id),
        getBookingSeatsByShowtime(time.id),
      ])) as [Seat[], Array<BookingSeat>];
      // Thêm sau khi setPendingSeats
      const selectedSeatIds = bookingSeats
        .filter(
          (bs) => bs.status === "PENDING" && bs.userId === session?.user?.id,
        )
        .map((bs) => {
          const seat = seatsData.find((s) => s.id === bs.seatId);
          return seat ? `${seat.row}${seat.number}` : null;
        })
        .filter(Boolean) as string[];

      setSelectedSeats(selectedSeatIds);

      const updatedSeats = seatsData.map((seat) => {
        const seatBookingSeats = bookingSeats.filter(
          (bs) => bs.seatId === seat.id,
        );
        return {
          ...seat,
          isBooked: seatBookingSeats.some((bs) => bs.status === "BOOKED"),
          bookingSeats: seatBookingSeats, // giữ nguyên tất cả bookingSeats, kể cả PENDING của user khác
        };
      });

      // Thêm ghế có trạng thái PENDING vào pendingSeats
      const pendingBookingSeats = bookingSeats.filter(
        (bs) => bs.status === "PENDING",
      );
      const pendingSeatIds = pendingBookingSeats
        .map((bs) => {
          const seat = seatsData.find((s) => s.id === bs.seatId);
          return seat ? `${seat.row}${seat.number}` : null;
        })
        .filter(Boolean) as string[];

      setPendingSeats(pendingSeatIds);
      setSelectedSeats(selectedSeatIds);
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

    // Kiểm tra nếu ghế đã được đặt
    if (!showtimeId || seat.bookingSeats?.some((bs) => bs.status === "BOOKED"))
      return;

    // Kiểm tra ghế PENDING từ cả database và socket
    const pendingBookingSeat = seat.bookingSeats?.find(
      (bs) => bs.status === "PENDING",
    );
    if (pendingBookingSeat || pendingSeats.includes(seatId)) {
      if (pendingBookingSeat?.userId !== session?.user?.id) {
        toast({
          title: "Error",
          description: "Ghế này đang được người khác chọn",
          variant: "destructive",
        });
        return;
      }
    }

    // Kiểm tra nếu ghế đã được chọn hay chưa
    const isSelected = selectedSeats.includes(seatId);
    const isPending = seat.bookingSeats?.some(
      (bs) => bs.status === "PENDING" && bs.userId === session?.user?.id,
    );

    // Nếu ghế PENDING của người hiện tại thì bỏ chọn
    const newSelectedSeats =
      isPending || isSelected
        ? selectedSeats.filter((id) => id !== seatId)
        : [...selectedSeats, seatId];

    setSelectedSeats(newSelectedSeats);

    // Emit socket event
    if (socketRef.current) {
      socketRef.current.emit(isSelected ? "unselect_seat" : "select_seat", {
        seatId,
        showtimeId,
        userId: session?.user?.id,
      });
    }

    try {
      if (isSelected) {
        const response = await fetch(`/api/bookingseats/${seat.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        setSeats((prev) =>
          prev.map((s) =>
            s.id === seat.id
              ? {
                  ...s,
                  bookingSeats: [], 
                  isBooked: false, 
                }
              : s,
          ),
        );
        setPendingSeats((prev) => prev.filter((id) => id !== seatId));
      } else {
        // Thêm ghế vào booking khi chọn
        const booking = await fetch("/api/bookings/upsert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            showtimeId,
            totalPrice: (selectedSeats.length + 1) * selectedShowTime.price,
          }),
        }).then((res) => res.json());

        // Tạo booking seat
        const response = await fetch("/api/bookingseats/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seatId: seat.id,
            showtimeId,
            status: "PENDING",
            userId: session?.user?.id,
            bookingId: booking.id,
            totalPrice: (selectedSeats.length + 1) * selectedShowTime.price,
          }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        // Cập nhật UI khi chọn ghế
        setSeats((prev) =>
          prev.map((s) =>
            s.id === seat.id
              ? {
                  ...s,
                  bookingSeats: [
                    {
                      id: 0,
                      seatId: s.id,
                      showtimeId: showtimeId!,
                      status: "PENDING" as const,
                      userId: session?.user?.id || "",
                      bookingId: undefined,
                    },
                  ],
                }
              : s,
          ),
        );
      }
    } catch (error) {
      console.error("[SEAT_SELECT_ERROR]", error);
      setSelectedSeats(
        isSelected
          ? [...newSelectedSeats, seatId]
          : newSelectedSeats.filter((id) => id !== seatId),
      );
      toast({
        title: "Error",
        description: "This seat is currently being selected by another user",
        variant: "destructive",
      });
    }
  };

  const handleBookTickets = async (paymentMethod?: string) => {
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
      // 1. Lấy tỷ giá USD → VND
      const response = await fetch('/api/exchange-rate');
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
  
      const { rate } = await response.json();
  
      // 2. Tính tổng số tiền (theo VND)
      const amount = Math.round(
        selectedSeats.length * (selectedShowTime?.price || 0) * rate
      );
  
      const returnUrl = `http://localhost:3000/payment-success`;
  
      // 3. Lưu thông tin ghế và URL hiện tại vào localStorage
      localStorage.setItem('selectedSeats', JSON.stringify({
        seats: selectedSeats,
        showtimeId: selectedShowTime?.id,
        movieId: slug,
        expiryTime: Date.now() + 30 * 60 * 1000, // 30 phút
        previousUrl: window.location.href // Lưu URL hiện tại
      }));
  
      // 4. Nếu dùng phương thức thanh toán MoMo
      if (paymentMethod === "qr" || paymentMethod === "napas" || paymentMethod === "visa") {
        let requestType = 'payWithCC';
        if (paymentMethod === 'qr') {
          requestType = 'captureWallet';
        } else if (paymentMethod === 'napas') {
          requestType = 'payWithATM';
        }
  
        const momoRes = await fetch('/api/momo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            orderInfo: 'Booking for Movie Tickets',
            returnUrl,
            ipnUrl: returnUrl,
            requestType,
          }),
        });
  
        if (!momoRes.ok) {
          throw new Error('Failed to create MoMo payment URL');
        }
  
        const { paymentUrl } = await momoRes.json();
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("[BOOKING_PAYMENT_ERROR]", error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(
        "https://server-socket-production-8dee.up.railway.app",
        {
          transports: ["websocket"],
        },
      );
      socketRef.current = socket;
    }

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

  useEffect(() => {
    return () => {
      selectedSeats.forEach(async (seatId) => {
        const seat = seats.find(s => `${s.row}${s.number}` === seatId);
        if (seat) {
          try {
            await fetch(`/api/bookingseats/${seat.id}`, {
              method: "DELETE",
            });
            
            if (socketRef.current) {
              socketRef.current.emit("unselect_seat", {
                seatId,
                showtimeId: selectedShowTime?.id,
                userId: session?.user?.id,
              });
            }
          } catch (error) {
            console.error("Cleanup error:", error);
          }
        }
      });
    };
  }, [selectedSeats, seats, selectedShowTime, session]);

  const handleSeatTimeout = async (seatId: string) => {
    const seat = seats.find(s => `${s.row}${s.number}` === seatId);
    if (seat) {
      try {
        await fetch(`/api/bookingseats/${seat.id}`, {
          method: "DELETE",
        });

        setSelectedSeats(prev => prev.filter(id => id !== seatId));
        setPendingSeats(prev => prev.filter(id => id !== seatId));

        if (socketRef.current) {
          socketRef.current.emit("unselect_seat", {
            seatId,
            showtimeId: selectedShowTime?.id,
            userId: session?.user?.id,
          });
        }

        toast({
          title: "Seat Released",
          description: `Your selection for seat ${seatId} has expired`,
          variant: "destructive",
        });
      } catch (error) {
        console.error("Timeout handling error:", error);
      }
    }
  };

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
                    currentUserId={session?.user?.id}
                  />
                  <SeatsLegend />
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <BookingDetails
                  selectedSeats={selectedSeats}
                  selectedShowTime={selectedShowTime}
                  onBookTickets={handleBookTickets}
                  onTimeout={handleSeatTimeout}
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
