import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = parseInt(params.id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID format" },
        { status: 400 }  // Bad Request
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        showtimes: {
          include: {
            screeningRoom: true,
          },
          orderBy: [{ date: "asc" }, { time: "asc" }],
        },
      },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }  // Not Found
      );
    }

    return NextResponse.json(movie, { status: 200 });  // OK
  } catch (error: any) {
    console.error("[GET_MOVIE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch movie", details: error.message },
      { status: 500 }  // Internal Server Error
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = parseInt(params.id);
    const { status } = await request.json();

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID format" },
        { status: 400 }  // Bad Request
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 422 }  // Unprocessable Entity
      );
    }

    const movie = await prisma.movie.update({
      where: { id: movieId },
      data: { status },
    });

    return NextResponse.json(
      { message: "Movie updated successfully", data: movie },
      { status: 200 }  // OK
    );
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }  // Not Found
      );
    }

    console.error("[UPDATE_MOVIE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update movie", details: error.message },
      { status: 500 }  // Internal Server Error
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = parseInt(params.id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID format" },
        { status: 400 }  // Bad Request
      );
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }  // Not Found
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.bookingSeat.deleteMany({
        where: {
          showtime: {
            movieId: movieId
          }
        }
      });

      await tx.showtime.deleteMany({
        where: {
          movieId: movieId
        }
      });

      await tx.movie.delete({
        where: {
          id: movieId
        }
      });
    });

    return NextResponse.json(
      { message: "Movie and related data deleted successfully" },
      { status: 200 }  // OK
    );
  } catch (error: any) {
    console.error("[DELETE_MOVIE_ERROR]", {
      error: error.message,
      code: error.code
    });
    
    return NextResponse.json(
      { error: "Failed to delete movie", details: error.message },
      { status: 500 }  // Internal Server Error
    );
  }
}
