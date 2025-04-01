import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onAddShowtime 
}: AddShowtimeDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ScreeningRoom | null>(null);
  const [newShowtime, setNewShowtime] = useState<Partial<Showtime>>({
    movieId: undefined,
    screeningRoomId: undefined,
    startTime: '',
    price: undefined
  });

  const handleSubmit = async () => {
    await onAddShowtime(newShowtime);
    setNewShowtime({
      movieId: undefined,
      screeningRoomId: undefined,
      startTime: '',
      price: undefined
    });
    setSelectedMovie(null);
    setSelectedRoom(null);
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
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium text-gray-200">Movie</label>
            <select
              disabled={isLoadingMovies}
              value={selectedMovie?.id || ""}
              onChange={(e) => {
                const movie = movies.find(m => m.id === parseInt(e.target.value));
                setSelectedMovie(movie || null);
                setNewShowtime({ ...newShowtime, movieId: parseInt(e.target.value) });
              }}
              className="w-full bg-gray-700/50 text-white border border-gray-600 p-2 rounded-lg mt-1"
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
          <div>
            <label className="text-sm font-medium text-gray-200">Room</label>
            <select
              disabled={isLoadingRooms}
              value={selectedRoom?.id || ""}
              onChange={(e) => {
                const room = rooms.find(r => r.id === parseInt(e.target.value));
                setSelectedRoom(room || null);
                setNewShowtime({ ...newShowtime, screeningRoomId: parseInt(e.target.value) });
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
          <div>
            <label className="text-sm font-medium text-gray-200">Start Time</label>
            <Input
              type="datetime-local"
              value={newShowtime.startTime}
              onChange={(e) => setNewShowtime({ ...newShowtime, startTime: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200">Price</label>
            <Input
              type="number"
              value={newShowtime.price}
              onChange={(e) => setNewShowtime({ ...newShowtime, price: parseFloat(e.target.value) })}
              placeholder="Enter price"
              className="mt-1"
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