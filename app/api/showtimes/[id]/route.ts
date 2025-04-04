import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const showtimes = await prisma.showtime.findMany({
      where: {
        movieId: parseInt(params.id),
      },
      include: {
        screeningRoom: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return NextResponse.json(showtimes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching showtimes" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.showtime.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: "Showtime deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error deleting showtime" },
      { status: 500 },
    );
  }
}
