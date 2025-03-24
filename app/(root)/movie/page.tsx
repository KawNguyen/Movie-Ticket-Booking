// page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Top from "@/components/ui/movie/movie-top";
import Bottom from "@/components/ui/movie/movie-bottom";

function page() {
  const [movie, setMovie] = useState<any | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("trailer");

  const API_KEY = "eaed1110f866ff7b33d2a304e94ef638";
  const movieId = 1396079;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-EN&append_to_response=credits,videos`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setCast(data.credits?.cast.slice() || []);
      })
      .catch((error) => console.error("Lỗi:", error));
  }, [activeTab]);

  if (!movie) return <p className="text-white">Loading...</p>;

  return (
    <div className="bg-black text-white min-h-screen">
      <Top movie={movie} cast={cast} />
      <Bottom movie={movie} cast={cast} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default page;
