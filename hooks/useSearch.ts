import { useState, useEffect, useCallback } from 'react';
import useDebounce from '@/hooks/useDebounce';

interface SearchConfig<T> {
  searchFn: (query: string) => Promise<T[]>;
  detailsFn?: (id: number | string) => Promise<T>;
  debounceTime?: number;
  minLength?: number;
}

export function useSearch<T>({
  searchFn,
  detailsFn,
  debounceTime = 300,
  minLength = 1,
}: SearchConfig<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [selected, setSelected] = useState<T | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedTerm = useDebounce(searchTerm, debounceTime);

  const search = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchFn(query);
      setResults(data);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tìm kiếm');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchFn]);

  useEffect(() => {
    if (!debouncedTerm.trim() || debouncedTerm.length < minLength) {
      setResults([]);
      setShowResults(false);
      return;
    }
    search(debouncedTerm);
  }, [debouncedTerm, minLength, search]);

  const handleSelect = useCallback(async (item: T, id?: number | string) => {
    if (!detailsFn || !id) {
      setSelected(item);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      const details = await detailsFn(id);
      setSelected(details);
      setShowResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi lấy chi tiết');
    } finally {
      setLoading(false);
    }
  }, [detailsFn]);

  const clearSelection = useCallback(() => {
    setSelected(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    selected,
    showResults,
    loading,
    error,
    handleSelect,
    clearSelection,
  };
}