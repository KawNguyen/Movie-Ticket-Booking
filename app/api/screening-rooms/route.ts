import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.screeningRoom.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching screening rooms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const room = await request.json();
    const newRoom = await prisma.screeningRoom.create({
      data: {
        name: room.name,
        capacity: room.capacity,
      },
    });
    return NextResponse.json(newRoom);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating screening room" }, { status: 500 });
  }
}