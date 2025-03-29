"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
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
    <div className="p-6 space-y-6 w-full h-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-white"
        />

        {showResults && results.length > 0 && (
          <div className="absolute top-10 z-10 bg-gray-900 p-4 rounded shadow-md overflow-hidden">
            <h3 className="text-white mb-2">Search Results:</h3>
            <ScrollArea className="max-h-[600px] overflow-y-auto">
              <ul className="space-y-2">
                {results.map((movie) => (
                  <li 
                    key={movie.id} 
                    className="flex items-center gap-4 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700" 
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-white text-xl font-semibold">Movie Details</h3>
          <div className="flex items-start gap-6">
            <Image 
              src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`} 
              alt={selectedMovie.title} 
              width={154} 
              height={231} 
              className="rounded-lg shadow-md" 
            />
            <div className="space-y-2">
              <p className="text-white text-2xl font-bold">
                {selectedMovie.title} ({new Date(selectedMovie.release_date).getFullYear()})
              </p>
              {selectedMovie.tagline && (
                <p className="italic text-gray-400">&quot;{selectedMovie.tagline}&quot;</p>
              )}
              <p className="text-gray-400 text-sm leading-relaxed">{selectedMovie.overview}</p>
              <p className="text-gray-300 text-sm">Runtime: {selectedMovie.runtime} mins</p>
              <p className="text-gray-300 text-sm flex">
                Rate: {selectedMovie.vote_average} 
                <Star color="yellow" fill="yellow" size={16} className="ml-1" />
              </p>
              <p className="text-gray-300 text-sm">
                Genres: {selectedMovie.genres?.map((g) => g.name).join(", ")}
              </p>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 text-white border border-gray-500 p-2 rounded mt-2 w-full"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={onAddMovie} className="w-full">Add Movie</Button>
        </div>
      )}

      <ScrollArea className="h-[80%] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white text-center">Id</TableHead>
              <TableHead className="text-white text-center">Image</TableHead>
              <TableHead className="text-white text-center">Title</TableHead>
              <TableHead className="text-white text-center">Release Date</TableHead>
              <TableHead className="text-white text-center">Duration</TableHead>
              <TableHead className="text-white text-center">Rate</TableHead>
              <TableHead className="text-white text-center">Status</TableHead>
              <TableHead className="text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedMovies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className="text-center">{movie.id}</TableCell>
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
                <TableCell className="text-center">
                  <div className="flex justify-center items-center">
                    {movie.vote_average} 
                    <Star color="yellow" fill="yellow" size={16} className="ml-1" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <select 
                    value={movie.status} 
                    onChange={(e) => handleStatusChange(movie.id, e.target.value)} 
                    className="bg-gray-700 text-white border border-gray-500 p-1 rounded mx-auto"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleRemoveMovie(movie.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default MovieManagement;
