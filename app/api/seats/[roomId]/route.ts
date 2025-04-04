import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } },
) {
  try {
    const seats = await prisma.seat.findMany({
      where: {
        screeningRoomId: parseInt(params.roomId),
      },
      include: {
        bookingSeats: {
          where: {
            showtimeId: parseInt(request.headers.get("showtime-id") || "0"),
          },
        },
      },
      orderBy: [{ row: "asc" }, { number: "asc" }],
    });

    return NextResponse.json(seats, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching seats" },
      { status: 500 },
    );
  }
}
