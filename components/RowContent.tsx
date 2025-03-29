"use client";

import { useMovieManagement } from "@/hooks/useMovieManagement";
import MovieList from "./MovieList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RowContent = ({ status }: { status: string }) => {
  const router = useRouter();
  const { fetchMoviesByStatus } = useMovieManagement();
  const [movies, setMovies] = useState<MovieCardProps[]>([]);

  useEffect(() => {
    const data = fetchMoviesByStatus(status);
    data.then((result) => setMovies(result));
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <span className="text-xl font-bold text-white">{status}</span>
        <span onClick={()=> router.push(`/movie`)}> View All</span>
      </div>
      <MovieList data={movies as MovieCardProps[]} />
    </div>
  );
};

export default RowContent;
