import { MovieService } from "@/services/movie.service";
import MovieList from "@/components/MovieList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - Movie Ticket Booking",
  description: "Browse upcoming movies in theaters",
};

const ComingSoon = async () => {
  const movies = await MovieService.getAllMoviesByStatus("Coming Soon");

  return (
    <main className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Coming Soon</h1>
          <p className="text-gray-400">
            Browse upcoming movies releasing in theaters
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

export default ComingSoon;