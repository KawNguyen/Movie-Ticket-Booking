export const getRooms = async () => {
  const response = await fetch('/api/screening-rooms');
  return response.json();
};

export const addRoom = async (room: Partial<ScreeningRoom>) => {
  const response = await fetch('/api/screening-rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(room),
  });
  return response.json();
};

export const deleteRoom = async (id: number) => {
  const response = await fetch(`/api/screening-rooms/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const getRoomShowtimes = async (roomId: number) => {
  const response = await fetch(`/api/screening-rooms/${roomId}/showtimes`);
  return response.json();
};