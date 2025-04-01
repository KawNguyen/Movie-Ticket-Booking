import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RoomListProps {
  rooms: ScreeningRoom[];
  isLoading: boolean;
  onDeleteRoom: (id: number) => Promise<void>;
  onSelectRoom: (room: ScreeningRoom) => void;
}

const RoomList = ({
  rooms,
  isLoading,
  onDeleteRoom,
  onSelectRoom,
}: RoomListProps) => {
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white w-[10%] text-center">
                ID
              </TableHead>
              <TableHead className="text-white w-[35%] text-center">
                Room Name
              </TableHead>
              <TableHead className="text-white w-[35%] text-center">
                Capacity
              </TableHead>
              <TableHead className="text-white w-[20%] text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow
                key={room.id}
                className="cursor-pointer hover:bg-gray-800/50"
                onClick={() => onSelectRoom(room)}
              >
                <TableCell className="text-center">{room.id}</TableCell>
                <TableCell className="text-center">{room.name}</TableCell>
                <TableCell className="text-center">{room.capacity}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    className="w-[80%] mx-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRoom(room.id);
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default RoomList;
