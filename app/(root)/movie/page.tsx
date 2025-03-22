"use client";
import React, { useEffect, useState } from "react";
function page() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<
    Array<{ id: number; name: string; profile_path: string | null }>
  >([]);
  const [activeTab, setActiveTab] = useState("trailer");

  const API_KEY = "eaed1110f866ff7b33d2a304e94ef638";
  const movieId = 1396079;
  interface Movie {
    title: string;
    backdrop_path: string;
    poster_path: string;
    release_date: string;
    genres: { id: number; name: string }[];
    overview: string;
    vote_average: number;
    runtime: number;
    credits: {
      cast: Array<{
        name: string;
      }>;
      crew: Array<{
        job: string;
        name: string;
      }>;
    };
    videos: {
      results: Array<{
        key: string;
      }>;
    };
  }

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits,videos`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setCast(data.credits?.cast.slice() || []);
      })
      .catch((error) => console.error("Lỗi:", error));
  }, [activeTab]);

  if (!movie) return <p className="text-white">Đang tải...</p>;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative">
        <img
          alt={movie?.title || "Movie poster"}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        />
        <div className="relative container mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center p-4 ">
            <img
              alt={movie.title}
              className="w-64 h-auto mb-4 md:mb-0 md:mr-6"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            />
            <div>
              <h1 className="text-2xl font-bold">{movie.title}</h1>
              <p className="text-gray-400">
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
                  <i className="fas fa-thumbs-up mr-2"></i>
                  Thích
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition duration-300">
                  <i className="fas fa-star mr-2"></i>
                  Đánh giá
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                  <i className="fas fa-ticket-alt mr-2"></i>
                  Mua vé
                </button>
              </div>
              <p className="mt-4 text-gray-300">{movie.overview}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-heart"></i>
                  <span>{movie.vote_average * 10}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{movie.release_date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-clock"></i>
                  <span>{movie.runtime} phút</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400">Diễn viên</p>
                <p className="text-white">
                  {cast.map((actor) => actor.name).join(", ")}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-gray-400">Đạo diễn</p>
                <p className="text-white">
                  {movie.credits?.crew.find((c) => c.job === "Director")
                    ?.name || "Chưa có thông tin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="flex space-x-4 border-b border-gray-700 pb-2">
            <button
              className={`px-4 py-2 ${
                activeTab === "trailer" ? "text-blue-500" : "text-gray-400"
              } hover:text-blue-400 focus:outline-none`}
              onClick={() => setActiveTab("trailer")}
            >
              Trailer
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "dienvien" ? "text-blue-500" : "text-gray-400"
              } hover:text-blue-400 focus:outline-none`}
              onClick={() => setActiveTab("dienvien")}
            >
              Diễn Viên
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-gray-300 focus:outline-none">
              Lịch chiếu
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-gray-300 focus:outline-none">
              Đánh giá
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-gray-300 focus:outline-none">
              Mua vé
            </button>
          </div>
        </div>
        <div className="mt-8">
          {activeTab === "trailer" && (
            <div className="container mx-auto p-4 mt-8">
              {movie.videos?.results.length > 0 ? (
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-96 md:h-[600px]"
                  frameBorder="0"
                  src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                  title="YouTube video player"
                ></iframe>
              ) : (
                <div className="text-center text-gray-400 py-20">
                  <i className="fas fa-film text-6xl mb-4"></i>
                  <p className="text-xl">Không tìm thấy trailer cho phim này</p>
                </div>
              )}
            </div>
          )}
          {activeTab === "dienvien" && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                    }
                    alt={actor.name}
                    className="w-full h-[300px] object-cover rounded-md shadow-lg"
                  />
                  <p className="mt-2 text-white">{actor.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
