import { getRooms, addRoom, deleteRoom, getRoomShowtimes } from '@/lib/api/rooms';

export class RoomService {
  static async getAllRooms() {
    try {
      return await getRooms();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  static async addRoom(room: Partial<ScreeningRoom>) {
    try {
      return await addRoom(room);
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  }

  static async deleteRoom(id: number) {
    try {
      return await deleteRoom(id);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  static async getRoomShowtimes(roomId: number) {
    try {
      return await getRoomShowtimes(roomId);
    } catch (error) {
      console.error('Error fetching room showtimes:', error);
      return [];
    }
  }
}