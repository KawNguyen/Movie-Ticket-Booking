"use client";

import MovieBottom from "@/components/movie/movie-bottom";
import MovieTop from "@/components/movie/movie-top";
import { fetchTmdbDetail } from "@/lib/tmdb";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MovieDetail = () => {
  const params = useParams();
  const movieId = params?.slug as string;
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async () => {
    try {
      const data = await fetchTmdbDetail(movieId);
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <>
      <head>
        <title>{movie.title}</title>
      </head>
      <main className="bg-black text-white min-h-screen">
        <MovieTop movie={movie} cast={movie.credits?.cast?.slice() || []} />
        <MovieBottom movie={movie} cast={movie.credits?.cast?.slice() || []} />
      </main>
    </>
  );
};

export default MovieDetail;
