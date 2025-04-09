import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getBookingsByUserId } from "@/lib/api/bookings";
import { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
}

interface ScreeningRoom {
  id: number;
  name: string;
}

interface Showtime {
  id: number;
  startTime: string;
  movie: Movie;
  screeningRoom: ScreeningRoom;
}

interface BookingSeat {
  id: number;
  seat: {
    id: number;
    row: string;
    number: number;
  };
}

interface Booking {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  showtime: Showtime;
  bookingSeats: BookingSeat[];
}

export const BookingHistory = ({ session }: { session: any }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useMediaQuery(640); // Using 640px as breakpoint for sm
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleBookingClick = async (booking: Booking) => {
    setSelectedBooking(booking);
    try {
      const response = await fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          showtimeId: booking.showtime.id,
          bookingId: booking.id,
        }),
      });

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
    } catch (error) {
      console.error("Failed to fetch QR code:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user?.id) {
        try {
          const data = await getBookingsByUserId(session?.user?.id);
          setBookings(data as any);
          console.log(data);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();
  }, [session?.user?.id]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Booking History</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="bg-gray-900 text-white border">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 h-full">
                <Skeleton className="w-full sm:w-32 h-48 bg-gray-800" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-3/4 bg-gray-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className="bg-gray-900 text-white border"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 h-full">
              <div className="w-full sm:w-32 overflow-hidden rounded-lg h-full">
                <AspectRatio ratio={isDesktop ? 2 / 3 : 16 / 9}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${
                      isDesktop
                        ? booking.showtime?.movie?.poster_path
                        : booking.showtime?.movie?.backdrop_path
                    }`}
                    alt={booking.showtime.movie.title}
                    fill
                    className="object-cover rounded-md"
                    priority
                  />
                </AspectRatio>
              </div>

              <div className="flex-1">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg sm:text-xl mb-2">
                    {booking.showtime.movie.title}
                  </CardTitle>
                </CardHeader>
                <div className="text-gray-400 text-sm space-y-2">
                  <div className="flex flex-row justify-between sm:items-center gap-1">
                    <span className="font-medium">Purchase Date:</span>
                    <span>
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between sm:items-center gap-1">
                    <span className="font-medium">Price:</span>
                    <span>${booking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-row justify-between sm:items-center gap-1">
                    <span className="font-medium">Show Date & Time:</span>
                    <span>
                      {new Date(booking.showtime.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between sm:items-center gap-1">
                    <span className="font-medium">Seats:</span>
                    <div className="flex flex-wrap gap-1">
                      {booking.bookingSeats.map((seat) => (
                        <Badge key={seat.id} variant="secondary">
                          {(seat as any)?.seat.row}
                          {(seat as any)?.seat.number}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between sm:items-center gap-1">
                    <span className="font-medium">Theater:</span>
                    <span>{booking.showtime.screeningRoom.name}</span>
                  </div>
                  <div className="flex flex-row justify-between sm:items-center gap-1">
                    <span className="font-medium">Status:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          booking.status === "COMPLETED"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                      <QrCode
                        className="w-5 h-5 cursor-pointer hover:text-green-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedBooking(null);
            setQrCodeUrl(null);
          }}
        >
          <div
            className="bg-gray-900 p-6 rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {qrCodeUrl ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="text-white text-center">Loading QR code...</div>
            )}
            <Button
              variant="destructive"
              className="mt-4 w-full"
              onClick={() => {
                setSelectedBooking(null);
                setQrCodeUrl(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
