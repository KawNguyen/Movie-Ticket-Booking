"use client";

import { useEffect, useState } from "react";
import { useRoomManagement } from '@/hooks/useRoomManagement';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
  import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RoomManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    rooms,
    selectedRoom,
    newRoom,
    setNewRoom,
    fetchRooms,
    handleAddRoom,
    handleRemoveRoom,
    handleViewShowtimes,
  } = useRoomManagement();

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-9rem)] gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Screening Room Management</h2>
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
                <label className="text-sm font-medium text-gray-200">Capacity</label>
                <Input
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  placeholder="Enter capacity"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddRoom} className="w-full">Add Room</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        <ScrollArea className="h-full w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white w-[10%] text-center">ID</TableHead>
                <TableHead className="text-white w-[35%] text-center">Room Name</TableHead>
                <TableHead className="text-white w-[35%] text-center">Capacity</TableHead>
                <TableHead className="text-white w-[20%] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow 
                  key={room.id} 
                  className="cursor-pointer hover:bg-gray-800/50"
                  onClick={() => handleViewShowtimes(room)}
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
                        handleRemoveRoom(room.id);
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <ScrollArea className="h-full w-full rounded-md border">
          {selectedRoom ? (
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default RoomManagement;