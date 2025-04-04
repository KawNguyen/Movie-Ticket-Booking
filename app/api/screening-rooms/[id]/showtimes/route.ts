import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const showtimes = await prisma.showtime.findMany({
      where: {
        screeningRoomId: parseInt(params.id),
      },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { time: "asc" }
      ],
    });

    return NextResponse.json(showtimes);
  } catch (error) {
    console.error("[SHOWTIMES_ERROR]", error);
    return NextResponse.json(
      { error: "Error fetching showtimes" },
      { status: 500 },
    );
  }
}
