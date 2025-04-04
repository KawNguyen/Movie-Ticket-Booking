import axios from "axios";

export async function fetchTmdbData(endpoint: string) {
  const { data } = await axios.get("/api/tmdb", {
    params: { endpoint },
  });
  return data;
}

export async function searchTmdbData(endpoint: string) {
  const { data } = await axios.get("/api/tmdb", {
    params: { endpoint },
  });
  return data;
}

export async function fetchTmdbDetail(movieId: string) {
  const { data } = await axios.get(`/api/tmdb/movie/${movieId}`);
  return data;
}
