import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const movie = await prisma.movie.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });
    return NextResponse.json(movie);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error updating movie" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.movie.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error deleting movie" }, { status: 500 });
  }
}