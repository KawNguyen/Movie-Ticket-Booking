import axios from "axios";

export const getShowtimes = async () => {
  try {
    const response = await axios.get("/api/showtimes");
    return response?.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch showtimes");
  }
};

export const getShowtimesByMovieId = async (movieId: string) => {
  try {
    const response = await axios.get(`/api/showtimes/${movieId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch showtimes for this movie");
  }
};

export const addShowtime = async (showtime: Partial<Showtime>) => {
  try {
    const response = await axios.post("/api/showtimes", showtime);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add showtime");
  }
};

export const deleteShowtime = async (id: number) => {
  try {
    const response = await axios.delete(`/api/showtimes/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete showtime");
  }
};
