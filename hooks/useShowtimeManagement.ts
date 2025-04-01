import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getShowtimes, addShowtime, deleteShowtime } from '@/lib/api/showtimes';
import { getRooms } from '@/lib/api/rooms';
import { getMovies } from '@/lib/api/movies';

export const useShowtimeManagement = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<ScreeningRoom[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [newShowtime, setNewShowtime] = useState({
    movieId: 0,
    screeningRoomId: 0,
    startTime: "",
    price: 0,
  });
  const { toast } = useToast();

  const fetchMovies = useCallback(async () => {
    try {
      const data = await getMovies();
      const nowShowingMovies = data.filter((movie: Movie) => movie.status === 'Now Showing');
      setMovies(nowShowingMovies);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch movies",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchRooms = useCallback(async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchShowtimes = useCallback(async () => {
    try {
      const data = await getShowtimes();
      setShowtimes(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch showtimes",
        variant: "destructive",
      });
    }
  }, [toast]);

  const checkTimeConflict = useCallback((newStartTime: Date, movieRuntime: number, roomId: number) => {
    const endTime = new Date(newStartTime.getTime() + (movieRuntime + 15) * 60000);
    
    return showtimes.some(showtime => {
      if (showtime.screeningRoomId !== roomId) return false;
      
      const existingStart = new Date(showtime.startTime);
      const existingMovie = movies.find(m => m.id === showtime.movieId);
      if (!existingMovie) return false;
      
      const existingEnd = new Date(existingStart.getTime() + ((existingMovie?.runtime || 0) + 15) * 60000);
      
      return (newStartTime < existingEnd && endTime > existingStart);
    });
  }, [showtimes, movies]);

  const handleAddShowtime = async () => {
    const selectedMovie = movies.find(m => m.id === newShowtime.movieId);
    if (!selectedMovie) {
      toast({
        title: "Error",
        description: "Please select a movie",
        variant: "destructive",
      });
      return false;
    }

    if (selectedMovie.status !== 'Now Showing') {
      toast({
        title: "Error",
        description: "Only now showing movies can be scheduled",
        variant: "destructive",
      });
      return false;
    }

    const startTime = new Date(newShowtime.startTime);
    if (checkTimeConflict(startTime, selectedMovie.runtime || 0, newShowtime.screeningRoomId)) {
      toast({
        title: "Error",
        description: "Time slot conflicts with existing showtime (including 15 minutes break)",
        variant: "destructive",
      });
      return false;
    }

    try {
      const addedShowtime = await addShowtime(newShowtime);
      setShowtimes(prev => [...prev, addedShowtime]);
      toast({
        title: "Success",
        description: "Showtime added successfully",
      });
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add showtime",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoveShowtime = async (id: number) => {
    try {
      await deleteShowtime(id);
      setShowtimes(prev => prev.filter(showtime => showtime.id !== id));
      toast({
        title: "Success",
        description: "Showtime removed successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to remove showtime",
        variant: "destructive",
      });
    }
  };

  return {
    movies,
    rooms,
    showtimes,
    newShowtime,
    setNewShowtime,
    fetchMovies,
    fetchRooms,
    fetchShowtimes,
    handleAddShowtime,
    handleRemoveShowtime,
  };
};