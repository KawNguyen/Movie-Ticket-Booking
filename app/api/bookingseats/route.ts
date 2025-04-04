import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { seatId, showtimeId, status } = body;

//     console.log('Creating booking seat with:', { seatId, showtimeId, status });

//     // Create new booking seat
//     const bookingSeat = await prisma.bookingSeat.create({
//       data: {
//         status: "Pending",
//         seatId: Number(seatId),
//         showtimeId: Number(showtimeId),
//         bookingId: undefined,
//       }
//     });

//     return NextResponse.json(bookingSeat, { status: 201 });
//   } catch (error: any) {
//     // Log detailed error information
//     console.error("[BOOKING_SEATS_CREATE_DETAILED]", {
//       error: error.message,
//       code: error.code,
//       meta: error.meta,
//       data: { seatId, showtimeId, status }  // Log the input data
//     });
    
//     return new NextResponse(error.message || "Internal Error", { status: 500 });
//   }
// }

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seatId = searchParams.get('seatId');
    const showtimeId = searchParams.get('showtimeId');

    if (!seatId || !showtimeId) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    await prisma.bookingSeat.delete({
      where: {
        seatId_showtimeId: {
          seatId: Number(seatId),
          showtimeId: Number(showtimeId)
        }
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BOOKING_SEATS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showtimeId = searchParams.get('showtimeId');

    if (!showtimeId) {
      return new NextResponse("Missing showtime ID", { status: 400 });
    }

    const bookingSeats = await prisma.bookingSeat.findMany({
      where: {
        showtimeId: Number(showtimeId)
      }
    });

    return NextResponse.json(bookingSeats);
  } catch (error) {
    console.error("[BOOKING_SEATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
