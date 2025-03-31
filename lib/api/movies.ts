export const getMovies = async () => {
  try {
    const response = await fetch("/api/movies");
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch movies");
  }
};

export const getMoviesByStatus = async(status: string) => {
  try {
    const response = await fetch(`/api/movies?status=${status}`);
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch movies by status');
  }
}

export const addMovie = async (movie: Movie) => {
  try {
    const response = await fetch("/api/movies", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movie),
    });
    return response.json();
  } catch (error) {
    throw new Error('Failed to add movie');
  }
}

export const deleteMovie = async (id: number) => {
  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error) {
    throw new Error('Failed to delete movie');
  }
}

export const updateMovieStatus = async (id: number, status: string) => {
  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  } catch (error) {
    throw new Error('Failed to update status');
  }
}
