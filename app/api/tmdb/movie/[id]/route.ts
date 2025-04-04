import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/movie/${params.id}`;
    const { data } = await axios.get(url, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        append_to_response: "credits,videos,similar,recommendations",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
