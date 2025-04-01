"use client";

import { useEffect, useState } from "react";
import { getRooms, addRoom, deleteRoom, getRoomShowtimes } from "@/lib/api/rooms";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import AddRoomDialog from "./room/AddRoomDialog";
import RoomList from "./room/RoomList";
import RoomShowtimes from "./room/RoomShowtimes";

const RoomManagement = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<ScreeningRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ScreeningRoom | null>(null);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await getRooms();
      setRooms(data as ScreeningRoom[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRoom = async (roomData: Partial<ScreeningRoom>) => {
    try {
      await addRoom(roomData);
      await fetchRooms();
      toast({
        title: "Success",
        description: "Room added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add room",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await deleteRoom(id);
      await fetchRooms();
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const handleViewShowtimes = async (room: ScreeningRoom) => {
    try {
      setIsLoadingShowtimes(true);
      const showtimes = await getRoomShowtimes(room.id);
      setSelectedRoom({ ...room, showtimes: showtimes as { id: number; startTime: string; movie: { id: number; title: string; }; price: number; bookedSeats: number; }[] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch showtimes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingShowtimes(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="p-6 flex flex-col h-[calc(100vh-9rem)] gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Screening Room Management</h2>
        <AddRoomDialog onAddRoom={handleAddRoom} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        <ScrollArea className="h-full w-full rounded-md border">
          <RoomList
            rooms={rooms}
            isLoading={isLoading}
            onDeleteRoom={handleDeleteRoom}
            onSelectRoom={handleViewShowtimes}
          />
        </ScrollArea>

        <ScrollArea className="h-full w-full rounded-md border">
          <RoomShowtimes
            selectedRoom={selectedRoom}
            isLoadingShowtimes={isLoadingShowtimes}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default RoomManagement;