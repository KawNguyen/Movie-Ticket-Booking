import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface SearchMoviesProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: any[];
  showResults: boolean;
  onSelectMovie: (movie: any) => void;
}

export function SearchMovies({
  searchTerm,
  setSearchTerm,
  results,
  showResults,
  onSelectMovie,
}: SearchMoviesProps) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="text-white bg-gray-800/30 border-gray-600 backdrop-blur-sm ring-2 ring-gray-700/50 focus:ring-blue-500/50 transition-all py-6 text-lg"
      />
      {showResults && results.length > 0 && (
        <div className="absolute top-14 z-20 w-full bg-gray-800/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-700/50">
          <ScrollArea className="h-[60vh]">
            <ul className="space-y-3">
              {results.map((movie) => (
                <li 
                  key={movie.id} 
                  className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-all duration-300" 
                  onClick={() => onSelectMovie(movie)}
                >
                  <Image 
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                    alt={movie.title} 
                    width={92} 
                    height={138} 
                    className="object-cover rounded" 
                  />
                  <div>
                    <p className="text-white font-bold">
                      {movie.title} ({new Date(movie.release_date).getFullYear()})
                    </p>
                    <p className="text-gray-400 text-sm">
                      {movie.overview?.length > 100 ? movie.overview.slice(0, 97) + "..." : movie.overview}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}