// components/Bottom.tsx
import React from "react";
import { Film } from "lucide-react";

interface BottomProps {
  movie: any;
  cast: Array<{ id: number; name: string; profile_path: string | null }>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const movieBottom: React.FC<BottomProps> = ({ movie, cast, activeTab, setActiveTab }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="flex space-x-4 border-b border-gray-700 pb-2">
          <button
            className={`px-4 py-2 ${activeTab === "trailer" ? "text-blue-500" : "text-gray-400"} hover:text-blue-400 focus:outline-none`}
            onClick={() => setActiveTab("trailer")}
          >
            Trailer
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "dienvien" ? "text-blue-500" : "text-gray-400"} hover:text-blue-400 focus:outline-none`}
            onClick={() => setActiveTab("dienvien")}
          >
            Cast
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-gray-300 focus:outline-none">
            Showtimes
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-gray-300 focus:outline-none">
            Reviews
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-gray-300 focus:outline-none">
            Book Tickets
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
                <Film className="mx-auto h-16 w-16 mb-4" />
                <p className="text-xl">No trailer found for this movie</p>
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
  );
};

export default movieBottom;
