import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (status) {
      const movies = await prisma.movie.findMany({
        where: {
          status: status
        },
        orderBy: {
          id: 'desc'
        }
      });
      return NextResponse.json(movies);
    }

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
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path,
        overview: movie.overview,
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