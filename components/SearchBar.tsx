import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<{ title: string; id: number }[]>([]);

    // Giả lập danh sách phim
    const movies = [
        { id: 1, title: "Avengers: Endgame" },
        { id: 2, title: "Spider-Man: No Way Home" },
        { id: 3, title: "The Batman" },
        { id: 4, title: "Interstellar" },
        { id: 5, title: "Inception" },
    ];

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filteredMovies = movies.filter((movie) =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredMovies);
        } else {
            setResults([]);
        }
    }, [searchTerm]);

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-3 py-2 border rounded-md"
            />
            {results.length > 0 && (
                <ul className="absolute left-0 w-full mt-2 bg-black border rounded-md shadow-lg z-50">
                    {results.map((movie) => (
                        <li key={movie.id} className="px-3 py-2  cursor-pointer">
                            <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
