import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const showtimes = await prisma.showtime.findMany({
      include: {
        movie: true,
        screeningRoom: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    return NextResponse.json(showtimes, { status: 200 });
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
    const body = await request.json();
    const { movieId, screeningRoomId, date, time, price } = body;

    // Get movie details to check duration
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) },
      select: { runtime: true },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const BUFFER_TIME = 15;
    const totalDuration = movie.runtime + BUFFER_TIME;

    const existingShowtimes = await prisma.showtime.findMany({
      where: {
        screeningRoomId: parseInt(screeningRoomId),
        date: new Date(date),
      },
      include: {
        movie: true,
      },
    });

    // Convert time to minutes for comparison
    const newShowTimeInMinutes =
      parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
    const newShowEndTime = newShowTimeInMinutes + totalDuration;

    for (const existing of existingShowtimes) {
      const existingTimeInMinutes =
        parseInt(existing.time.split(":")[0]) * 60 +
        parseInt(existing.time.split(":")[1]);
      const existingEndTime =
        existingTimeInMinutes + existing.movie.runtime + BUFFER_TIME;

      // Check if times overlap
      if (
        (newShowTimeInMinutes >= existingTimeInMinutes &&
          newShowTimeInMinutes < existingEndTime) ||
        (newShowEndTime > existingTimeInMinutes &&
          newShowEndTime <= existingEndTime) ||
        (newShowTimeInMinutes <= existingTimeInMinutes &&
          newShowEndTime >= existingEndTime)
      ) {
        return NextResponse.json(
          {
            error: "Time slot conflicts with an existing showtime in this room",
          },
          { status: 409 },
        );
      }
    }

    const showtime = await prisma.showtime.create({
      data: {
        movieId: parseInt(movieId),
        screeningRoomId: parseInt(screeningRoomId),
        date: new Date(date),
        time,
        price: parseFloat(price),
      },
      include: {
        movie: true,
        screeningRoom: true,
      },
    });

    return NextResponse.json(showtime, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating showtime" },
      { status: 500 },
    );
  }
}
