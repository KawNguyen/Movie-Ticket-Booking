import { NextResponse } from "next/server";
import QRCode from "qrcode";
import {prisma} from "@/lib/prisma";

// Add these interfaces at the top of the file
interface Seat {
  id: number;
  row: string;
  number: number;
}

interface BookingSeat {
  id: number;
  seat: Seat;
}

interface Showtime {
  id: number;
  startTime: Date;
  movie: {
    id: number;
    title: string;
    // Add other movie properties as needed
  };
  screeningRoom: {
    id: number;
    name: string;
  };
}

interface Booking {
  id: number;
  totalPrice: number;
  createdAt: Date;
  showtime: Showtime;
  bookingSeats: BookingSeat[];
}

export async function POST(request: Request) {
  const { bookingId } = await request.json();

  try {
    // Fetch complete booking data from Prisma
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        showtime: {
          include: {
            movie: true,
            screeningRoom: true
          }
        },
        bookingSeats: {
          include: {
            seat: true
          }
        }
      }
    }) as unknown as Booking; // Type assertion

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Prepare QR code data
    const qrData = {
      bookingId: bookingId,
      movieTitle: booking.showtime.movie.title,
      screeningRoom: booking.showtime.screeningRoom.name,
      showtime: booking.showtime.startTime,
      seats: booking.bookingSeats.map((bs: { seat: { row: string; number: number } }) => `${bs.seat.row}${bs.seat.number}`),
      totalPrice: booking.totalPrice,
      purchaseDate: booking.createdAt.toISOString(),
      qrValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

    return NextResponse.json({ 
      qrCodeUrl,
      ticketData: qrData // Optional: return the data for debugging
    }, { status: 200 });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}