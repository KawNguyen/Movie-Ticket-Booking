import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const url = `${BASE_URL}/${endpoint}`;
    const params: any = { 
      api_key: API_KEY,
      language: "en-US"
    };

    if (endpoint.includes('search')) {
      params.query = searchParams.get('query');
      params.page = searchParams.get('page') || 1;
    }

    const { data } = await axios.get(url, { params });
    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}