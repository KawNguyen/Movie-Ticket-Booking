import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getMovies, addMovie, deleteMovie, updateMovieStatus, getMoviesByStatus } from '@/lib/api/movies';

export const useMovieManagement = () => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchMoviesByStatus = useCallback(async (status: string) => {
    setIsLoading(true);
    try {
      const data = await getMoviesByStatus(status);
      setSelectedMovies(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch movies by status",
        variant: "destructive",
      });
      setSelectedMovies([]);
      return [];
    } finally {
      setIsLoading(false);
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
    isLoading,
    fetchMovies,
    fetchMoviesByStatus,
    handleAddMovie,
    handleRemoveMovie,
    handleStatusChange,
  };
};