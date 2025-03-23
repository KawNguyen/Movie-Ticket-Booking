const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
// const BASE_URL = "https://api.themoviedb.org/3";

// export async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
//   if (!API_KEY) {
//     throw new Error("TMDb API key is missing. Please check your .env.local file.");
//   }

//   const url = new URL(`${BASE_URL}/${endpoint}`);
//   url.searchParams.append("api_key", API_KEY);
  
//   Object.entries(params).forEach(([key, value]) => {
//     url.searchParams.append(key, value);
//   });

//   const response = await fetch(url.toString());
//   if (!response.ok) {
//     throw new Error(`API error: ${response.status}`);
//   }

//   return response.json();
// }


export async function fetchTmdbData(endpoint: string) {
  const res = await fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
