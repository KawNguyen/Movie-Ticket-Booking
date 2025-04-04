import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(params.bookingId)
      },
      include: {
        bookingSeats: {
          include: {
            seat: true
          }
        },
        showtime: {
          include: {
            movie: true,
            screeningRoom: true
          }
        },
        user: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching booking" }, { status: 500 });
  }
}