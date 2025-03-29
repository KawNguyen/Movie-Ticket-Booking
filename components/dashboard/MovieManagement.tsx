"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trash2 } from "lucide-react";
import { useMovieManagement } from '@/hooks/useMovieManagement';
import { useMovieSearch } from '@/hooks/useMovieSearch';

const statuses = ["Now Showing", "Coming Soon"];

const MovieManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  
  const {
    searchTerm,
    setSearchTerm,
    results,
    selectedMovie,
    showResults,
    handleSelectMovie,
    clearSelectedMovie,
  } = useMovieSearch();

  const {
    selectedMovies,
    fetchMovies,
    handleAddMovie,
    handleRemoveMovie,
    handleStatusChange,
  } = useMovieManagement();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const onAddMovie = async () => {
    if (!selectedMovie || selectedMovies.some((m) => m.id === selectedMovie.id)) return;
    const success = await handleAddMovie({ ...selectedMovie, status: selectedStatus });
    if (success) {
      clearSelectedMovie();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        <div className="space-y-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-white bg-gray-800/30 border-gray-600 backdrop-blur-sm ring-2 ring-gray-700/50 focus:ring-blue-500/50 transition-all"
            />
            {showResults && results.length > 0 && (
              <div className="absolute top-12 z-10 w-full bg-gray-800/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-700/50">
                <h3 className="text-white mb-4 font-semibold">Search Results:</h3>
                <ScrollArea className="max-h-[500px]">
                  <ul className="space-y-3">
                    {results.map((movie) => (
                      <li 
                        key={movie.id} 
                        className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-all duration-300" 
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
            <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700/50 w-full hover:bg-gray-800/50 transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 space-y-4">
                  <div className="relative group">
                    <Image 
                      src={`https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}`} 
                      alt={selectedMovie.title} 
                      width={342} 
                      height={513} 
                      className="rounded-lg shadow-xl transform group-hover:scale-105 transition-all duration-300 w-full" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
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

                <div className="lg:w-2/3 space-y-4  ">
                  <div>
                    <h3 className="text-white text-3xl font-bold mb-2">{selectedMovie.title}</h3>
                    <p className="text-gray-400 text-lg">
                      ({new Date(selectedMovie.release_date).getFullYear()})
                    </p>
                  </div>

                  <div className="bg-gray-700/20 p-4 rounded-lg">
                    <h4 className="text-gray-300 font-semibold mb-2">Overview</h4>
                    <ScrollArea className="h-[100px]">
                      <p className="text-gray-300 leading-relaxed pr-4">{selectedMovie.overview}</p>
                    </ScrollArea>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-gray-300 font-semibold">Status</h4>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-gray-700/50 text-white border border-gray-600 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    onClick={onAddMovie} 
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 py-6 text-lg font-semibold"
                  >
                    Add to Collection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-gray-700/50 rounded-xl bg-gray-800/30 backdrop-blur-md shadow-xl">
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-800 z-10">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-white text-center">Image</TableHead>
                  <TableHead className="text-white text-center">Title</TableHead>
                  <TableHead className="text-white text-center">Release Date</TableHead>
                  <TableHead className="text-white text-center">Duration</TableHead>
                  <TableHead className="text-white text-center">Status</TableHead>
                  <TableHead className="text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]" >
            <Table>
              <TableBody>
                {selectedMovies.map((movie) => (
                  <TableRow 
                    key={movie.id}
                    className="hover:bg-gray-700/30 transition-colors duration-200"
                  >
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Image 
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                          alt={movie.title} 
                          width={92} 
                          height={138} 
                          className="rounded shadow-md" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{movie.title}</TableCell>
                    <TableCell className="text-center">{movie.release_date}</TableCell>
                    <TableCell className="text-center">{movie.runtime}</TableCell>
                    {/* <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        {movie.vote_average} 
                        <Star color="yellow" fill="yellow" size={16} className="ml-1" />
                      </div>
                    </TableCell> */}
                    <TableCell className="text-center">
                      <select 
                        value={movie.status} 
                        onChange={(e) => handleStatusChange(movie.id, e.target.value)} 
                        className="bg-gray-700/50 text-white border border-gray-600 p-2 rounded-lg transition-all hover:bg-gray-600/50"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="destructive" 
                        onClick={() => handleRemoveMovie(movie.id)}
                        className="hover:bg-red-600/80 transition-colors duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MovieManagement;
