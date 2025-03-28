"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { fetchTmdbData, searchTmdbData } from "@/lib/tmdb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statuses = ["Now Showing", "Coming Soon"];

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  status?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  tagline?: string;
};

const MovieManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const fetchData = async () => {
      const data = await searchTmdbData(`search/movie?query=${debouncedSearchTerm}`);
      console.log(data.results)
      setResults(data.results || []);
      setShowResults(true);
    };

    fetchData();
  }, [debouncedSearchTerm]);

  const handleSelectMovie = async (movie: Movie) => {
    if (selectedMovie?.id === movie.id) return;

    const movieDetails = await fetchTmdbData(`movie/${movie.id}`);
    setSelectedMovie(movieDetails);
    console.log(movieDetails);
    setShowResults(false);
  };

  // Add this useEffect to fetch existing movies when component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        setSelectedMovies(data);
      } catch (error) {
        console.log(error)
        toast({
          title: "Error",
          description: "Failed to fetch movies",
          variant: "destructive",
        });
      }
    };
    fetchMovies();
  }, []);

  const handleAddMovie = async () => {
    if (!selectedMovie || selectedMovies.some((m) => m.id === selectedMovie.id)) return;

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedMovie, status: selectedStatus }),
      });

      if (!response.ok) throw new Error('Failed to add movie');

      const newMovie = await response.json();
      setSelectedMovies((prev) => [...prev, newMovie]);
      setSelectedMovie(null);
      toast({
        title: "Success",
        description: "Movie added successfully",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive",
      });
    }
  };

  // Modify handleRemoveMovie
  const handleRemoveMovie = async (id: number) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete movie');

      setSelectedMovies((prev) => prev.filter((movie) => movie.id !== id));
      toast({
        title: "Success",
        description: "Movie removed successfully",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to remove movie",
        variant: "destructive",
      });
    }
  };

  // Modify handleStatusChange
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setSelectedMovies((prev) =>
        prev.map((movie) => (movie.id === id ? { ...movie, status: newStatus } : movie))
      );
      toast({
        title: "Success",
        description: "Movie status updated successfully",
      });
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to update movie status",
        variant: "destructive",
      });
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
          <div className="absolute top-10 z-10 bg-gray-900 p-4 rounded shadow-md overflow-hidden ">
            <h3 className="text-white mb-2">Search Results:</h3>
            <ScrollArea className="max-h-[600px] overflow-y-auto">
              <ul className="space-y-2">
                {results.map((movie) => (
                  <li key={movie.id} className="flex items-center gap-4 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700" onClick={() => handleSelectMovie(movie)}>
                    <Image src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} width={92} height={138} className="object-cover rounded" />
                    <div>
                      <p className="text-white font-bold">{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
                      <p className="text-gray-400 text-sm">{movie.overview?.length > 100 ? movie.overview.slice(0, 97) + "..." : movie.overview}</p>
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
            <Image src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`} alt={selectedMovie.title} width={154} height={231} className="rounded-lg shadow-md" />
            <div className="space-y-2">
              <p className="text-white text-2xl font-bold">{selectedMovie.title} ({new Date(selectedMovie.release_date).getFullYear()})</p>
              {selectedMovie.tagline && <p className="italic text-gray-400">&quot;{selectedMovie.tagline}&quot;</p>}
              <p className="text-gray-400 text-sm leading-relaxed">{selectedMovie.overview}</p>
              <p className="text-gray-300 text-sm">Runtime: {selectedMovie.runtime} mins</p>
              <p className="text-gray-300 text-sm flex">Rate: {selectedMovie.vote_average} <Star color="yellow" fill="yellow" size={16} className="ml-1" /> </p>
              <p className="text-gray-300 text-sm">Genres: {selectedMovie.genres?.map((g) => g.name).join(", ")}</p>
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
          <Button onClick={handleAddMovie} className="w-full">Add Movie</Button>
        </div>
      )}

      <ScrollArea className="h-[80%] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Id</TableHead>
              <TableHead className="text-white">Image</TableHead>
              <TableHead className="text-white">Title</TableHead>
              <TableHead className="text-white">Release Date</TableHead>
              <TableHead className="text-white">Duration</TableHead>
              <TableHead className="text-white">Rate</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedMovies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>{movie.id}</TableCell>
                <TableCell>
                  <Image src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} width={92} height={138} className="rounded shadow-md" />
                </TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.release_date}</TableCell>
                <TableCell>{movie.runtime}</TableCell>
                <TableCell>
                  <div className="flex">
                    {movie.vote_average} <Star color="yellow" fill="yellow" size={16} className="ml-1" />
                  </div>
                </TableCell>
                <TableCell>
                  <select value={movie.status} onChange={(e) => handleStatusChange(movie.id, e.target.value)} className="bg-gray-700 text-white border border-gray-500 p-1 rounded">
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleRemoveMovie(movie.id)}>Remove</Button>
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
