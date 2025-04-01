import { useState, useEffect } from 'react';
import { searchMovies } from '@/lib/api/movies';
import useDebounce from './useDebounce';

export function useMovieSearch(delay = 500) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchMovies(debouncedQuery);
        setResults(data as Movie[]);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading
  };
}