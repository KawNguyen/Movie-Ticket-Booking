import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { seatId, showtimeId, status } = body;

    const updatedBookingSeat = await prisma.bookingSeat.upsert({
      where: {
        seatId_showtimeId: {
          seatId,
          showtimeId
        }
      },
      update: { status },
      create: {
        status,
        seat: {
          connect: { id: seatId }
        },
        showtime: {
          connect: { id: showtimeId }
        },
        booking: {
          connect: { id: body.bookingId }
        }
      }
    });

    return NextResponse.json(updatedBookingSeat, { status: 200 });
  } catch (error) {
    console.error("[BOOKING_SEATS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}