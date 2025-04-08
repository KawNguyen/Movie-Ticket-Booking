import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { showtimeId, userId, totalPrice, status, bookingSeats } = body;

//     // Validate required fields
//     if (!showtimeId || !userId || !totalPrice || !Array.isArray(bookingSeats)) {
//       return NextResponse.json(
//         { error: "Missing required fields or invalid bookingSeats format" },
//         { status: 400 },
//       );
//     }

//     // Validate bookingSeats structure
//     for (const seat of bookingSeats) {
//       if (!seat.seatId || !seat.showtimeId) {
//         return NextResponse.json(
//           {
//             error: "Invalid booking seat data. Required: seatId and showtimeId",
//           },
//           { status: 400 },
//         );
//       }
//     }

//     // Check if showtime exists
//     const showtime = await prisma.showtime.findUnique({
//       where: { id: showtimeId },
//     });

//     if (!showtime) {
//       return NextResponse.json(
//         { error: "Showtime not found" },
//         { status: 404 },
//       );
//     }

//     const booking = await prisma.booking.create({
//       data: {
//         showtimeId,
//         userId,
//         totalPrice,
//         status: status || "PENDING",
//         bookingSeats: {
//           create: bookingSeats.map((seat) => ({
//             seatId: seat.seatId,
//             showtimeId: seat.showtimeId,
//             status: "PROCESSING",
//           })),
//         },
//       },
//       include: {
//         bookingSeats: true,
//         showtime: true,
//         user: true,
//       },
//     });

//     return NextResponse.json(booking);
//   } catch (error) {
//     console.error("[BOOKING_CREATE_ERROR]", error);
//     return NextResponse.json(
//       {
//         error: "Error creating booking",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     );
//   }
// }

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        bookingSeats: {
          include: {
            seat: true,
          },
        },
        showtime: {
          include: {
            movie: true,
            screeningRoom: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching bookings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }
    const { userId, showtimeId, status } = body;

    const booking = await prisma.booking.findFirst({
      where: {
        userId,
        showtimeId,
      },
      select: {
        id: true,
        bookingSeats: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status,
      },
      include: {
        bookingSeats: true,
      },
    });

    // Update status of related booking seats
    await prisma.bookingSeat.updateMany({
      where: {
        bookingId: booking.id,
      },
      data: {
        status: "BOOKED",
      },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating booking" },
      { status: 500 },
    );
  }
}
