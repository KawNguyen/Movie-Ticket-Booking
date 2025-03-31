import { MovieService } from "@/services/movie.service";
import MovieList from "@/components/MovieList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now Showing - Movie Ticket Booking",
  description: "Browse all movies currently showing in theaters",
};

const NowShowing = async () => {
  const movies = await MovieService.getAllMoviesByStatus("Now Showing");

  return (
    <main className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Now Showing</h1>
          <p className="text-gray-400">
            Browse all movies currently in theaters
          </p>
        </div>
      </div>

      <MovieList
        movies={movies as MovieCardProps[]}
        limit={0} // Show all movies
      />
    </main>
  );
};

export default NowShowing;
