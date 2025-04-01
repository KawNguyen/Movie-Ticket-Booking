import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

interface MovieDetailsProps {
  movie: any;
  selectedStatus: string;
  statuses: string[];
  onStatusChange: (status: string) => void;
  onAddMovie: () => void;
}

export function MovieDetails({
  movie,
  selectedStatus,
  statuses,
  onStatusChange,
  onAddMovie,
}: MovieDetailsProps) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700/50 flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="relative">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-lg shadow-xl w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-white text-2xl font-bold">{movie.title}</h3>
            <p className="text-gray-400">
              ({new Date(movie.release_date).getFullYear()})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/20 p-3 rounded-lg text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                Runtime
              </p>
              <p className="text-white text-[12px] ">{movie.runtime} mins</p>
            </div>
            <div className="bg-gray-700/20 p-3 rounded-lg text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                Rating
              </p>
              <p className="text-white text-[12px] flex items-center justify-center">
                {movie.vote_average}
                <Star color="yellow" fill="yellow" size={12} className="ml-2" />
              </p>
            </div>
          </div>

          <div className="bg-gray-700/20 p-4 rounded-lg">
            <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-3">
              Genres
            </h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre: any) => (
                <span
                  key={genre.name}
                  className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-[12px]"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-gray-300 font-semibold">Status</h4>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-gray-700/50 text-white border border-gray-600 p-3 rounded-lg"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={onAddMovie}
          className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-semibold mt-4"
        >
          Add to Collection
        </Button>
      </div>
    </div>
  );
}
