import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const showtimes = await prisma.showtime.findMany({
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            runtime: true,
          },
        },
        screeningRoom: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
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

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const showtime = await prisma.showtime.create({
      data: {
        movieId: data.movieId,
        screeningRoomId: data.screeningRoomId,
        startTime: new Date(data.startTime),
        price: data.price,
      },
      include: {
        movie: true,
        screeningRoom: true,
      },
    });
    return NextResponse.json(showtime);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating showtime" },
      { status: 500 },
    );
  }
}
