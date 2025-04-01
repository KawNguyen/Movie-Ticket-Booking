"use client";

import { useEffect, useState } from "react";
import { getShowtimes, addShowtime, deleteShowtime } from "@/lib/api/showtimes";
import { getMoviesByStatus } from "@/lib/api/movies";
import { getRooms } from "@/lib/api/rooms";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import AddShowtimeDialog from "./showtime/AddShowtimeDialog";
import ShowtimeList from "./showtime/ShowtimeList";

const ShowTimeManagement = () => {
  const { toast } = useToast();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<ScreeningRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isAddingShowtime, setIsAddingShowtime] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const fetchMovies = async () => {
    try {
      setIsLoadingMovies(true);
      const nowShowingMovies = await getMoviesByStatus("Now Showing");
      setMovies(nowShowingMovies as Movie[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch movies",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const roomsData = await getRooms();
      setRooms(roomsData as ScreeningRoom[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      setIsLoading(true);
      const data = await getShowtimes();
      setShowtimes(data as Showtime[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch showtimes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShowtime = async (showtimeData: Partial<Showtime>) => {
    if (!showtimeData.movieId || !showtimeData.screeningRoomId || !showtimeData.startTime || !showtimeData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (showtimeData.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAddingShowtime(true);
      await addShowtime({
        ...showtimeData,
        startTime: new Date(showtimeData.startTime).toISOString(),
      });
      await fetchShowtimes();
      toast({
        title: "Success",
        description: "Thêm suất chiếu thành công",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add showtime",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAddingShowtime(false);
    }
  };

  const handleDeleteShowtime = async (id: number) => {
    try {
      setIsDeletingId(id);
      await deleteShowtime(id);
      await fetchShowtimes();
      toast({
        title: "Success",
        description: "Showtime deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete showtime",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchRooms();
    fetchShowtimes();
  }, []);

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-9rem)] gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Showtime Management</h2>
        <AddShowtimeDialog
          movies={movies}
          rooms={rooms}
          isLoadingMovies={isLoadingMovies}
          isLoadingRooms={isLoadingRooms}
          isAddingShowtime={isAddingShowtime}
          onAddShowtime={async (data) => { await handleAddShowtime(data); }}
        />
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <ShowtimeList
            showtimes={showtimes}
            isDeletingId={isDeletingId}
            onDeleteShowtime={handleDeleteShowtime}
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default ShowTimeManagement;