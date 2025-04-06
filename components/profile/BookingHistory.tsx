import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getBookingsByUserId } from "@/lib/api/bookings";
import { useEffect, useState } from "react";

export const BookingHistory = () => {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (session?.user?.id) {
        try {
          const data = await getBookingsByUserId(session.user.id);
          setBookings(data as any);
          console.log(data)
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="bg-gray-900 text-white">
            <CardContent className="p-4 flex">
              <div className="w-32 h-48 overflow-hidden rounded-lg">
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${booking.showtime?.movie?.backdrop_path}`}
                  alt={booking.showtime.movie.title}
                  height={480}
                  width={360}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-6 flex-1">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">
                    {booking.showtime.movie.title}
                  </CardTitle>
                </CardHeader>
                <div className="text-gray-400 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Purchase Date:</span>
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>${booking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Show Date & Time:</span>
                    <span>
                      {new Date(booking.showtime.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <div className="flex gap-1">
                      {booking.bookingSeats.map((seat) => (
                        <Badge key={seat.id} variant="secondary">
                          {(seat as any)?.seat.row}{(seat as any)?.seat.number}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Theater:</span>
                    <span>{booking.showtime.screeningRoom.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge 
                      variant={booking.status === "COMPLETED" ? "default" : "destructive"}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
