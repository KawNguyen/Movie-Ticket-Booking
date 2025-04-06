import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, showtimeId, totalPrice } = body;

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId }
    });

    if (!showtime) {
      return NextResponse.json(
        { error: "Showtime not found" },
        { status: 404 }
      );
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        showtimeId
      }
    });

    const booking = existingBooking
      ? await prisma.booking.update({
          where: { id: existingBooking.id },
          data: { 
            totalPrice: totalPrice
          }
        })
      : await prisma.booking.create({
          data: {
            userId,
            showtimeId,
            totalPrice : totalPrice,
            status: "PENDING"
          }
        });

    return NextResponse.json(booking);
  } catch (error) {
    return new NextResponse(JSON.stringify({ 
      message: "Failed to upsert booking",
      error: error instanceof Error ? error.message : "Unknown error"
    }), { status: 500 });
  }
}