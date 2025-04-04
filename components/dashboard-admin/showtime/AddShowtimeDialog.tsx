import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddShowtimeDialogProps {
  movies: Movie[];
  rooms: ScreeningRoom[];
  isLoadingMovies: boolean;
  isLoadingRooms: boolean;
  isAddingShowtime: boolean;
  onAddShowtime: (showtimeData: Partial<Showtime>) => Promise<void>;
}

const AddShowtimeDialog = ({
  movies,
  rooms,
  isLoadingMovies,
  isLoadingRooms,
  isAddingShowtime,
  onAddShowtime,
}: AddShowtimeDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ScreeningRoom | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [newShowtime, setNewShowtime] = useState<Partial<Showtime>>({
    movieId: undefined,
    screeningRoomId: undefined,
    date: "",
    time: "",
    price: undefined,
  });

  const handleSubmit = async () => {
    await onAddShowtime({
      ...newShowtime,
    });
    setNewShowtime({
      movieId: undefined,
      screeningRoomId: undefined,
      date: undefined,
      time: undefined,
      price: undefined,
    });
    setSelectedMovie(null);
    setSelectedRoom(null);
    setSelectedDate("");
    setSelectedTime("");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add New Showtime</Button>
      </DialogTrigger>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Add New Showtime</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new showtime.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="movie">Movie</Label>
            <select
              id="movie"
              disabled={isLoadingMovies}
              value={selectedMovie?.id || ""}
              onChange={(e) => {
                const movie = movies.find(
                  (m) => m.id === parseInt(e.target.value)
                );
                setSelectedMovie(movie || null);
                setNewShowtime({
                  ...newShowtime,
                  movieId: parseInt(e.target.value),
                });
              }}
              className="w-full bg-gray-700/50 text-white border border-gray-600 p-2 rounded-lg"
            >
              {isLoadingMovies ? (
                <option>Loading movies...</option>
              ) : (
                <>
                  <option value="">Select a movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <select
              id="room"
              disabled={isLoadingRooms}
              value={selectedRoom?.id || ""}
              onChange={(e) => {
                const room = rooms.find(
                  (r) => r.id === parseInt(e.target.value)
                );
                setSelectedRoom(room || null);
                setNewShowtime({
                  ...newShowtime,
                  screeningRoomId: parseInt(e.target.value),
                });
              }}
              className="w-full bg-gray-700/50 text-white border border-gray-600 p-2 rounded-lg mt-1"
            >
              {isLoadingRooms ? (
                <option>Loading rooms...</option>
              ) : (
                <>
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div className="space-y-4">
            <Label>Start Time</Label>
            <div className="w-full flex justify-between gap-2">
              <div className="w-full">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setNewShowtime({
                      ...newShowtime,
                      date: e.target.value,
                    });
                  }}
                  className="[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    setNewShowtime({
                      ...newShowtime,
                      time: e.target.value,
                    });
                  }}
                  className="[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={newShowtime.price || ""}
              onChange={(e) =>
                setNewShowtime({
                  ...newShowtime,
                  price: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Enter price"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isAddingShowtime}
          >
            {isAddingShowtime ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "Add Showtime"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddShowtimeDialog;
