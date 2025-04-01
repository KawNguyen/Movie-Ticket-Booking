import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AddRoomDialogProps {
  onAddRoom: (roomData: Partial<ScreeningRoom>) => Promise<void>;
}

const AddRoomDialog = ({ onAddRoom }: AddRoomDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: 0,
  });

  const handleSubmit = async () => {
    await onAddRoom(newRoom);
    setNewRoom({ name: "", capacity: 0 });
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add New Room</Button>
      </DialogTrigger>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>Add New Screening Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium text-bladck">Room Name</label>
            <Input
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              placeholder="Enter room name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200">
              Capacity
            </label>
            <Input
              type="number"
              value={newRoom.capacity}
              onChange={(e) =>
                setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })
              }
              placeholder="Enter capacity"
              className="mt-1"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add Room
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomDialog;
