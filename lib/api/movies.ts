import axios from 'axios';

export const getMovies = async () => {
  try {
    const response = await axios.get("/api/movies");
    return response?.data;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to fetch movies");
  }
};

export const getMoviesByStatus = async(status: string) => {
  try {
    const response = await axios.get(`/api/movies?status=${status}`);
    return response?.data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch movies by status');
  }
}

export const searchMovies = async (query: string) => {
  try {
    const response = await axios.get(`/api/movies?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to search movies');
  }
}

export const addMovie = async (movie: Movie) => {
  try {
    const response = await axios.post("/api/movies", movie);
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to add movie');
  }
}

export const deleteMovie = async (id: number) => {
  try {
    const response = await axios.delete(`/api/movies/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to delete movie');
  }
}

export const updateMovieStatus = async (id: number, status: string) => {
  try {
    const response = await axios.patch(`/api/movies/${id}`, { status });
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to update status');
  }
}
