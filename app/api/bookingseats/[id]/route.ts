import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);

    if (!id || isNaN(id)) {
      return new NextResponse("Invalid seat ID", { status: 400 });
    }

    const bookingSeat = await prisma.bookingSeat.findFirst({
      where: {
        seatId: id,
      },
      include: {
        showtime: true,
        booking: true,
      },
    });

    if (!bookingSeat) {
      return new NextResponse("Booking seat not found", { status: 404 });
    }

    if (bookingSeat.booking) {
      await prisma.booking.update({
        where: {
          id: bookingSeat.booking.id,
        },
        data: {
          totalPrice: bookingSeat.booking.totalPrice - bookingSeat.showtime.price,
        },
      });
    }

    await prisma.bookingSeat.deleteMany({
      where: {
        seatId: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BOOKING_SEATS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(request: Request, { params }: { params: { seatId: string } }) {
    const { seatId } = params;
  
    try {
      const bookingSeat = await prisma.bookingSeat.findFirst({
        where: {
          seatId: parseInt(seatId),
        },
      });
  
      return NextResponse.json({ exists: !!bookingSeat });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to check seat status' },
        { status: 500 }
      );
    }
  }