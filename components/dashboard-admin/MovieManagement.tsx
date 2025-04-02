"use client";

import { useEffect, useState, useCallback } from "react";
import { useMovieSearch } from "@/hooks/useMovieSearchTMDB";
import {
  getMovies,
  addMovie,
  deleteMovie,
  updateMovieStatus,
} from "@/lib/api/movies";
import { useToast } from "@/hooks/use-toast";
import { SearchMovies } from "./movie/SearchMovies";
import { MovieDetails } from "./movie/MovieDetails";
import { MovieTable } from "./movie/MovieTable";

const statuses = ["Now Showing", "Coming Soon"];

const MovieManagement = () => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    results,
    selectedMovie,
    showResults,
    handleSelectMovie,
    clearSelectedMovie,
  } = useMovieSearch();

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      const movies = await getMovies();
      setSelectedMovies(movies as Movie[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch movies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const onAddMovie = async () => {
    if (
      !selectedMovie ||
      selectedMovies.some((movie: Movie) => movie.id === selectedMovie.id)
    ) {
      toast({
        title: "Warning",
        description: "Movie already exists or no movie selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const movieData = {
        tmdb_id: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview || "",
        poster_path: selectedMovie.poster_path || "",
        backdrop_path: selectedMovie.backdrop_path || "",
        release_date: selectedMovie.release_date || new Date().toISOString(),
        runtime: selectedMovie.runtime || 0,
        vote_average: selectedMovie.vote_average || 0,
        genres: selectedMovie.genres?.map((genre) => genre.name) || [],
        status: selectedStatus,
      };

      await addMovie(movieData as unknown as Movie);
      await fetchMovies();
      clearSelectedMovie();
      setSearchTerm("");

      toast({
        title: "Success",
        description: `${movieData.title} has been added to the collection`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add movie",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMovie = async (id: number) => {
    try {
      await deleteMovie(id);
      await fetchMovies();
      toast({
        title: "Success",
        description: "Movie has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove movie",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateMovieStatus(id, status);
      await fetchMovies();
      toast({
        title: "Success",
        description: "Movie status has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen p-6 w-full">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        <div className="xl:col-span-1 flex flex-col gap-6">
          <SearchMovies
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            results={results}
            showResults={showResults}
            onSelectMovie={handleSelectMovie}
          />

          {selectedMovie && (
            <MovieDetails
              movie={selectedMovie}
              selectedStatus={selectedStatus}
              statuses={statuses}
              onStatusChange={setSelectedStatus}
              onAddMovie={onAddMovie}
            />
          )}
        </div>

        <MovieTable
          movies={selectedMovies}
          isLoading={isLoading}
          statuses={statuses}
          onStatusChange={handleStatusChange}
          onRemoveMovie={handleRemoveMovie}
        />
      </div>
    </div>
  );
};

export default MovieManagement;
