const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTmdbData(endpoint: string) {
  const res = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
