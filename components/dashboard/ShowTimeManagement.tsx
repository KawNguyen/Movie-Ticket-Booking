"use client";

import { useState, useEffect } from "react";
import { useShowtimeManagement } from '@/hooks/useShowtimeManagement';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formatDateTime = (date: Date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const ShowTimeManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
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
  } = useShowtimeManagement();

  useEffect(() => {
    fetchMovies();
    fetchRooms();
    fetchShowtimes();
  }, [fetchMovies, fetchRooms, fetchShowtimes]);

  const onAddShowtime = async () => {
    const success = await handleAddShowtime();
    if (success) {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-9rem)] gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Showtime Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Showtime</Button>
          </DialogTrigger>
          <DialogContent className="bg-black">
            <DialogHeader>
              <DialogTitle>Add New Showtime</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-gray-200">Movie</label>
                <select
                  value={newShowtime.movieId}
                  onChange={(e) => setNewShowtime({ ...newShowtime, movieId: Number(e.target.value) })}
                  className="w-full mt-1 bg-gray-700 text-white border border-gray-500 p-2 rounded"
                >
                  <option value={0}>Select a movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Screening Room</label>
                <select
                  value={newShowtime.screeningRoomId}
                  onChange={(e) => setNewShowtime({ ...newShowtime, screeningRoomId: Number(e.target.value) })}
                  className="w-full mt-1 bg-gray-700 text-white border border-gray-500 p-2 rounded"
                >
                  <option value={0}>Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Start Time</label>
                <input
                  type="datetime-local"
                  value={newShowtime.startTime}
                  onChange={(e) => setNewShowtime({ ...newShowtime, startTime: e.target.value })}
                  className="w-full mt-1 bg-gray-700 text-white border border-gray-500 p-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Price ($)</label>
                <input
                  type="number"
                  value={newShowtime.price}
                  onChange={(e) => setNewShowtime({ ...newShowtime, price: Number(e.target.value) })}
                  className="w-full mt-1 bg-gray-700 text-white border border-gray-500 p-2 rounded"
                />
              </div>
              <Button onClick={handleAddShowtime} className="w-full">Add Showtime</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1 w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white text-center w-[15%]">Movie</TableHead>
              <TableHead className="text-white text-center w-[15%]">Room</TableHead>
              <TableHead className="text-white text-center w-[20%]">Start Time</TableHead>
              <TableHead className="text-white text-center w-[15%]">End Time</TableHead>
              <TableHead className="text-white text-center w-[15%]">Price</TableHead>
              <TableHead className="text-white text-center w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showtimes.map((showtime) => {
              const movie = movies.find(m => m.id === showtime.movieId);
              const startTime = new Date(showtime.startTime);
              const endTime = new Date(startTime.getTime() + ((movie?.runtime || 0) + 15) * 60000);
              
              return (
                <TableRow key={showtime.id}>
                  <TableCell className="text-center">{showtime.movie.title}</TableCell>
                  <TableCell className="text-center">{showtime.screeningRoom.name}</TableCell>
                  <TableCell className="text-center">{formatDateTime(startTime)}</TableCell>
                  <TableCell className="text-center">{formatTime(endTime)}</TableCell>
                  <TableCell className="text-center">${showtime.price}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveShowtime(showtime.id)}
                      className="w-[80%] mx-auto"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ShowTimeManagement;