import { useState, useEffect } from 'react';
import { fetchTmdbData, searchTmdbData } from '@/lib/tmdb';
import useDebounce from '@/hooks/useDebounce';

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
      const data = await searchTmdbData(`search/movie?query=${debouncedSearchTerm}`);
      setResults(data.results || []);
      setShowResults(true);
    };

    fetchData();
  }, [debouncedSearchTerm]);

  const handleSelectMovie = async (movie: Movie) => {
    if (selectedMovie?.id === movie.id) return;

    const movieDetails = await fetchTmdbData(`movie/${movie.id}`);
    setSelectedMovie(movieDetails);
    setShowResults(false);
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