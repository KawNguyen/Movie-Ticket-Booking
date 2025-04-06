import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      console.error("Missing userId:", userId);
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userBookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log("Fetched bookings:", userBookings);
    return NextResponse.json(userBookings, {status: 200});
  } catch (error) {
    // Log detailed error information
    console.error("Detailed error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      userId: params.userId
    });

    return NextResponse.json(
      { 
        error: "Error fetching user bookings",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}