export const getShowtimes = async () => {
  const response = await fetch('/api/showtimes');
  return response.json();
};

export const addShowtime = async (showtime: Partial<Showtime>) => {
  const response = await fetch('/api/showtimes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(showtime),
  });
  return response.json();
};

export const deleteShowtime = async (id: number) => {
  const response = await fetch(`/api/showtimes/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};