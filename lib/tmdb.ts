import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY =
  process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;

export async function fetchTmdbData(endpoint: string) {
  const { data } = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: {
      api_key: API_KEY,
    },
  });
  return data;
}

export async function searchTmdbData(endpoint: string) {
  const { data } = await axios.get(`${BASE_URL}/${endpoint}`, {
    params: {
      api_key: API_KEY,
    },
  });
  return data;
}

export async function fetchTmdbDetail(movieid: string) {
  const { data } = await axios.get(`${BASE_URL}/movie/${movieid}`, {
    params: {
      api_key: API_KEY,
      language: "en-EN",
      append_to_response: "credits,videos",
    },
  });
  return data;
}
