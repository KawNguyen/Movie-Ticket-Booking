"use client";

import { useCallback, useEffect, useState } from "react";
import MovieList from "../MovieList";
import { getMoviesByStatus } from "@/lib/api/movies";

const TemplateMoviesByStatus = ({ status }: { status: string }) => {
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const fetchMovies = useCallback(async () => {
    try {
      const ns = await getMoviesByStatus(`${status}`);
      setMovies(ns as MovieCardProps[]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [status]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

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

      <MovieList movies={movies as MovieCardProps[]} limit={0} />
    </main>
  );
};

export default TemplateMoviesByStatus;
