const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTmdbData(endpoint: string) {
  const res = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
export async function fetchTmdbDetail(movieid: string) {
  const res = await fetch(`${BASE_URL}/movie/${movieid}?api_key=${API_KEY}&language=en-EN&append_to_response=credits,videos`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
export async function searchTmdbData(endpoint: string) {
  const res = await fetch(`${BASE_URL}/${endpoint}&api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
