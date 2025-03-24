// components/Top.tsx
import React from "react";
import { ThumbsUp, Star, Ticket, Heart, Calendar, Clock } from "lucide-react";

interface TopProps {
  movie: any;
  cast: Array<{ id: number; name: string; profile_path: string | null }>;
}

const movieTop: React.FC<TopProps> = ({ movie, cast }) => {
  return (
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
              {movie.genres.map((g: { name: string }) => g.name).join(", ")}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
                <ThumbsUp className="inline mr-2 h-4 w-4" />
                Like
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition duration-300">
                <Star className="inline mr-2 h-4 w-4" />
                Rate
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-300">
                <Ticket className="inline mr-2 h-4 w-4" />
                Book Tickets
              </button>
            </div>
            <p className="mt-4 text-gray-300">{movie.overview}</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{movie.vote_average * 10}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.release_date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{movie.runtime} phút</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-400">Cast</p>
              <p className="text-white">
                {cast.map((actor) => actor.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default movieTop;
