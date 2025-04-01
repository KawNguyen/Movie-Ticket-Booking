import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ShowtimeListProps {
  showtimes: Showtime[];
  isDeletingId: number | null;
  onDeleteShowtime: (id: number) => Promise<void>;
}

const ShowtimeList = ({
  showtimes,
  isDeletingId,
  onDeleteShowtime,
}: ShowtimeListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white w-[25%]">Movie</TableHead>
          <TableHead className="text-white w-[20%]">Room</TableHead>
          <TableHead className="text-white w-[25%]">Start Time</TableHead>
          <TableHead className="text-white w-[15%]">Price</TableHead>
          <TableHead className="text-white w-[15%]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {showtimes.map((showtime) => (
          <TableRow key={showtime.id}>
            <TableCell>{showtime.movie?.title}</TableCell>
            <TableCell>{showtime.screeningRoom?.name}</TableCell>
            <TableCell>
              {new Date(showtime.startTime).toLocaleString()}
            </TableCell>
            <TableCell>${showtime.price}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                onClick={() => onDeleteShowtime(showtime.id)}
                className="w-full"
                disabled={isDeletingId === showtime.id}
              >
                {isDeletingId === showtime.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Delete"
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShowtimeList;
