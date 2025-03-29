export const getMovies = async () => {
  const response = await fetch('/api/movies');
  if (!response.ok) throw new Error('Failed to fetch movies');
  return response.json();
};

export const getMoviesByStatus = async (status: string) => {
  const response = await fetch(`/api/movies?status=${status}`);
  if (!response.ok) throw new Error('Failed to fetch movies by status');
  return response.json();
};

export const addMovie = async (movie: Movie) => {
  const response = await fetch('/api/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  if (!response.ok) throw new Error('Failed to add movie');
  return response.json();
};

export const deleteMovie = async (id: number) => {
  const response = await fetch(`/api/movies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete movie');
};

export const updateMovieStatus = async (id: number, status: string) => {
  const response = await fetch(`/api/movies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
};