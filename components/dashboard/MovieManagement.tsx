"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trash2 } from "lucide-react";
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { MovieService } from "@/services/movie.service";
import { Loader2 } from "lucide-react";

const statuses = ["Now Showing", "Coming Soon"];

const MovieManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [selectedMovies, setSelectedMovies] = useState<MovieCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    searchTerm,
    setSearchTerm,
    results,
    selectedMovie,
    showResults,
    handleSelectMovie,
    clearSelectedMovie,
  } = useMovieSearch();

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      const movies = await MovieService.getAllMovies();
      setSelectedMovies(movies as MovieCardProps[]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onAddMovie = async () => {
    if (!selectedMovie || selectedMovies.some((m) => m.id === selectedMovie.id)) return;
    
    try {
      await MovieService.addMovie({ ...selectedMovie, status: selectedStatus });
      await fetchMovies();
      clearSelectedMovie();
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleRemoveMovie = async (id: number) => {
    try {
      await MovieService.deleteMovie(id);
      await fetchMovies();
    } catch (error) {
      console.error('Error removing movie:', error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await MovieService.updateMovieStatus(id, status);
      await fetchMovies();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        <div className="xl:col-span-1 flex flex-col gap-6">
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
                        onClick={() => handleSelectMovie(movie)}
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

          {selectedMovie && (
            <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-700/50 flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                    alt={selectedMovie.title} 
                    width={500} 
                    height={750} 
                    className="rounded-lg shadow-xl w-full" 
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <h3 className="text-white text-2xl font-bold">{selectedMovie.title}</h3>
                    <p className="text-gray-400">
                      ({new Date(selectedMovie.release_date).getFullYear()})
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/20 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Runtime</p>
                      <p className="text-white text-[12px] ">{selectedMovie.runtime} mins</p>
                    </div>
                    <div className="bg-gray-700/20 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Rating</p>
                      <p className="text-white text-[12px] flex items-center justify-center">
                        {selectedMovie.vote_average}
                        <Star color="yellow" fill="yellow" size={12} className="ml-2" />
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700/20 p-4 rounded-lg">
                    <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genres?.map((genre) => (
                        <span key={genre.name} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-[12px]">
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
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-gray-700/50 text-white border border-gray-600 p-3 rounded-lg"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
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
          )}
        </div>

        <div className="xl:col-span-2 border border-gray-700/50 rounded-xl bg-gray-800/30 backdrop-blur-md shadow-xl overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-white font-semibold w-[40%]">Movie</TableHead>
                  <TableHead className="text-white font-semibold text-center w-[15%]">Release Date</TableHead>
                  <TableHead className="text-white font-semibold text-center w-[15%]">Duration</TableHead>
                  <TableHead className="text-white font-semibold text-center w-[20%]">Status</TableHead>
                  <TableHead className="text-white font-semibold text-center w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <ScrollArea className="h-[1000px]">
            <Table>
              {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="h-[400px]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-gray-400">Loading movies...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {selectedMovies.map((movie:any) => (
                    <TableRow 
                      key={movie.id}
                      className="hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <TableCell className="w-[40%]">
                        <div className="flex items-center gap-4">
                          <Image 
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                            alt={movie.title} 
                            width={46} 
                            height={69} 
                            className="rounded shadow-md min-w-[46px]" 
                          />
                          <span className="font-medium text-white line-clamp-1">{movie.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center w-[15%]">{movie.release_date}</TableCell>
                      <TableCell className="text-center w-[15%]">{movie.runtime} min</TableCell>
                      <TableCell className="text-center w-[20%]">
                        <select 
                          value={movie.status} 
                          onChange={(e) => handleStatusChange(movie.id, e.target.value)} 
                          className="w-full bg-gray-700/50 text-white border border-gray-600 p-2 rounded-lg"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="text-center w-[10%]">
                        <Button 
                          variant="destructive" 
                          onClick={() => handleRemoveMovie(movie.id)}
                          size="sm"
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
              )}
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MovieManagement;
