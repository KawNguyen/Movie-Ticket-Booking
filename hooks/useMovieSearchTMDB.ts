import { useState, useEffect } from "react";
import { fetchTmdbData, searchTmdbData } from "@/lib/tmdb";
import useDebounce from "@/hooks/useDebounce";

export const useMovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const fetchData = async () => {
      const data = await searchTmdbData(
        `search/movie?query=${debouncedSearchTerm}`,
      );
      setResults(
        Array.isArray((data as any)?.results) ? (data as any).results : [],
      );
      setShowResults(true);
    };

    fetchData();
  }, [debouncedSearchTerm]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowResults(false);
    setSearchTerm(""); // Add this line to clear search term
  };

  const clearSelectedMovie = () => setSelectedMovie(null);

  return {
    searchTerm,
    setSearchTerm,
    results,
    selectedMovie,
    showResults,
    handleSelectMovie,
    clearSelectedMovie,
  };
};
