import axios from 'axios';

export const getRooms = async () => {
  try {
    const response = await axios.get('/api/screening-rooms');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch rooms');
  }
};

export const addRoom = async (room: Partial<ScreeningRoom>) => {
  try {
    const response = await axios.post('/api/screening-rooms', room);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add room');
  }
};

export const deleteRoom = async (id: number) => {
  try {
    const response = await axios.delete(`/api/screening-rooms/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete room');
  }
};

export const getRoomShowtimes = async (roomId: number) => {
  try {
    const response = await axios.get(`/api/screening-rooms/${roomId}/showtimes`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch room showtimes');
  }
};