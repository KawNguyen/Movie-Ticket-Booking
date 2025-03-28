import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    return NextResponse.json(movies);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error fetching movies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const movie = await request.json();
    const newMovie = await prisma.movie.create({
      data: {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        runtime: movie.runtime,
        vote_average: movie.vote_average,
        status: movie.status,
      },
    });
    return NextResponse.json(newMovie);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating movie" }, { status: 500 });
  }
}