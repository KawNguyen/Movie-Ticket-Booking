import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { showtimeId, userId, totalPrice, status, bookingSeats } = body;

    const booking = await prisma.booking.create({
      data: {
        showtimeId,
        userId,
        totalPrice,
        status,
        bookingSeats: {
          create: bookingSeats
        }
      },
      include: {
        bookingSeats: true,
        showtime: true,
        user: true
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        bookingSeats: {
          include: {
            seat: true
          }
        },
        showtime: {
          include: {
            movie: true,
            screeningRoom: true
          }
        },
        user: true
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching bookings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const booking = await prisma.booking.update({
      where: {
        id: id
      },
      data: {
        status
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Error updating booking" }, { status: 500 });
  }
}