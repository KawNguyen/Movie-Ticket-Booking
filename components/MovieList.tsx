"use client";

import MovieCard from "./MovieCard";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

interface MovieListProps {
  movies: MovieCardProps[];
  limit?: number;
}

const MovieList = ({ movies, limit = 5 }: MovieListProps) => {
  const limitedItems = limit ? movies.slice(0, limit) : movies;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {limitedItems?.map((movie: any) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          year={movie.release_date}
          rating={movie.vote_average}
          duration={movie.runtime || 0}
          imageUrl={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : '/fallback-movie-poster.jpg'}
        />
      ))}
    </div>
  );
};

export default MovieList;
