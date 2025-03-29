import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getMovies, addMovie, deleteMovie, updateMovieStatus } from '@/lib/api/movies';

export const useMovieManagement = () => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const { toast } = useToast();

  const fetchMovies = useCallback(async () => {
    try {
      const data = await getMovies();
      setSelectedMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch movies",
        variant: "destructive",
      });
      setSelectedMovies([]);
    }
  }, [toast]);

  const handleAddMovie = useCallback(async (movie: Movie) => {
    try {
      const newMovie = await addMovie(movie);
      setSelectedMovies((prev) => [...prev, newMovie]);
      toast({
        title: "Success",
        description: "Movie added successfully",
      });
      return true;
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const handleRemoveMovie = useCallback(async (id: number) => {
    try {
      await deleteMovie(id);
      setSelectedMovies((prev) => prev.filter((movie) => movie.id !== id));
      toast({
        title: "Success",
        description: "Movie removed successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to remove movie",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleStatusChange = useCallback(async (id: number, newStatus: string) => {
    try {
      await updateMovieStatus(id, newStatus);
      setSelectedMovies((prev) =>
        prev.map((movie) => (movie.id === id ? { ...movie, status: newStatus } : movie))
      );
      toast({
        title: "Success",
        description: "Movie status updated successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update movie status",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    selectedMovies,
    fetchMovies,
    handleAddMovie,
    handleRemoveMovie,
    handleStatusChange,
  };
};