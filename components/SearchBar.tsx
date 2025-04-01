"use client"

import { useMovieSearch } from "@/hooks/useMovieSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const { query, setQuery, results, isLoading } = useMovieSearch();
  const router = useRouter();

  const handleMovieClick = (movieId: number) => {
    setQuery("");
    router.push(`/movie/${movieId}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-800">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full max-h-[80vh] overflow-y-auto bg-black/95 border-gray-800">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white">Search Movies</SheetTitle>
        </SheetHeader>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 bg-transparent border-gray-700 focus:border-gray-500"
            />
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {results.length > 0 && (
            <ul className="space-y-2">
              {results.map((movie) => (
                <li key={movie.id}>
                  <SheetClose asChild>
                    <button 
                      onClick={() => handleMovieClick(movie.id)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="relative h-24 w-16 flex-shrink-0">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center">
                            <Search className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{movie.title}</h3>
                        <div className="mt-1 text-sm text-gray-400 flex items-center gap-2">
                          <span>{movie.release_date?.split('-')[0]}</span>
                          <span>•</span>
                          <span className="text-gray-500">{movie.status}</span>
                        </div>
                      </div>
                    </button>
                  </SheetClose>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-10">
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No movies found</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchBar;
