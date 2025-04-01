import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface RoomShowtimesProps {
  selectedRoom: ScreeningRoom | null;
  isLoadingShowtimes: boolean;
}

const RoomShowtimes = ({ selectedRoom, isLoadingShowtimes }: RoomShowtimesProps) => {
  return (
    <>
      {isLoadingShowtimes ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : selectedRoom ? (
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-4">
            Showtimes for {selectedRoom.name}
          </h3>
          {selectedRoom.showtimes && selectedRoom.showtimes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white w-[30%] text-center">Movie</TableHead>
                  <TableHead className="text-white w-[30%] text-center">Start Time</TableHead>
                  <TableHead className="text-white w-[20%] text-center">Price</TableHead>
                  <TableHead className="text-white w-[20%] text-center">Seats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRoom.showtimes.map((showtime) => (
                  <TableRow 
                    key={showtime.id} 
                    className={`hover:bg-gray-800/50 ${
                      showtime.bookedSeats >= selectedRoom.capacity ? 'bg-red-900/50' : ''
                    }`}
                  >
                    <TableCell className="text-center">{showtime.movie.title}</TableCell>
                    <TableCell className="text-center">
                      {new Date(showtime.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">${showtime.price}</TableCell>
                    <TableCell className="text-center">
                      {showtime.bookedSeats}/{selectedRoom.capacity}
                      {showtime.bookedSeats >= selectedRoom.capacity && 
                        <span className="text-red-500 ml-2">(Full)</span>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-400">No showtimes scheduled for this room.</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Select a room to view its showtimes
        </div>
      )}
    </>
  );
};

export default RoomShowtimes;