import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { seatId, showtimeId, status } = body;

    const updatedBookingSeat = await prisma.bookingSeat.update({
      where: {
        seatId_showtimeId: {
          seatId,
          showtimeId,
        },
      },
      data: {
        status
      }
    });

    return NextResponse.json(updatedBookingSeat, { status: 200 });
  } catch (error) {
    console.error("[BOOKING_SEATS_UPDATE]", error);
    return new NextResponse(JSON.stringify({ 
      message: "Failed to update booking seat",
      error: error instanceof Error ? error.message : "Unknown error"
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seatId, showtimeId, status = "PENDING", userId ,totalPrice} = body;

    // Validate required fields
    if (!seatId || !showtimeId || !userId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get showtime information to get the price
    const showtime = await prisma.showtime.findUnique({
      where: {
        id: showtimeId
      }
    });

    if (!showtime) {
      return new NextResponse("Showtime not found", { status: 404 });
    }

    // Find or create booking for this user and showtime
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        showtimeId
      }
    });

    const booking = existingBooking 
      ? await prisma.booking.update({
          where: { id: existingBooking.id },
          data: {}
        })
      : await prisma.booking.create({
          data: {
            userId,
            showtimeId,
            totalPrice: totalPrice,
            status: "PENDING"
          }
        });

    // Create booking seat linked to the booking
    const newBookingSeat = await prisma.bookingSeat.create({
      data: {
        status,
        seatId,
        showtimeId,
        bookingId: booking.id
      }
    });

    return NextResponse.json(newBookingSeat, { status: 201 });
  } catch (error) {
    console.error("[BOOKING_SEATS_POST]", error);
    return new NextResponse(JSON.stringify({ 
      message: "Failed to create booking seat",
      error: error instanceof Error ? error.message : "Unknown error"
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
