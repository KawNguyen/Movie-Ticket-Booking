import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


export const useRoomManagement = () => {
  const [rooms, setRooms] = useState<ScreeningRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ScreeningRoom | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<ScreeningRoom>>({
    name: "",
    capacity: 0,
  });
  const { toast } = useToast();

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/screening-rooms');
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch screening rooms",
        variant: "destructive",
      });
    }
  };

  const handleAddRoom = async () => {
    try {
      const response = await fetch('/api/screening-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error('Failed to add screening room');

      const addedRoom = await response.json();
      setRooms((prev) => [...prev, addedRoom]);
      setNewRoom({ name: "", capacity: 0 });
      toast({
        title: "Success",
        description: "Screening room added successfully",
      });
      return true;
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to add screening room",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoveRoom = async (id: number) => {
    try {
      const response = await fetch(`/api/screening-rooms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete screening room');

      setRooms((prev) => prev.filter((room) => room.id !== id));
      toast({
        title: "Success",
        description: "Screening room removed successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to remove screening room",
        variant: "destructive",
      });
    }
  };

  const handleViewShowtimes = async (room: ScreeningRoom) => {
    try {
      const response = await fetch(`/api/screening-rooms/${room.id}/showtimes`);
      const data = await response.json();
      setSelectedRoom({ ...room, showtimes: data });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch showtimes",
        variant: "destructive",
      });
    }
  };

  return {
    rooms,
    selectedRoom,
    newRoom,
    setNewRoom,
    fetchRooms,
    handleAddRoom,
    handleRemoveRoom,
    handleViewShowtimes,
  };
};