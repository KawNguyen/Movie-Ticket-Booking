import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";

interface MovieTableProps {
  movies: any[];
  isLoading: boolean;
  statuses: string[];
  onStatusChange: (id: number, status: string) => void;
  onRemoveMovie: (id: number) => void;
}

export function MovieTable({
  movies,
  isLoading,
  statuses,
  onStatusChange,
  onRemoveMovie,
}: MovieTableProps) {
  return (
    <div className="xl:col-span-2 border border-gray-700/50 rounded-xl bg-gray-800/30 backdrop-blur-md shadow-xl overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10">
            <TableRow className="border-b border-gray-700">
              <TableHead className="text-white font-semibold w-[40%]">
                Movie
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-[15%]">
                Release Date
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-[15%]">
                Duration
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-[20%]">
                Status
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-[10%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <ScrollArea className="h-[1000px]">
        <Table>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="h-screen">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-gray-400">Loading movies...</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {movies.map((movie) => (
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
                      <span className="font-medium text-white line-clamp-1">
                        {movie.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center w-[15%]">
                    {movie.release_date}
                  </TableCell>
                  <TableCell className="text-center w-[15%]">
                    {movie.runtime} min
                  </TableCell>
                  <TableCell className="text-center w-[20%]">
                    <select
                      value={movie.status}
                      onChange={(e) => onStatusChange(movie.id, e.target.value)}
                      className="w-full bg-gray-700/50 text-white border border-gray-600 p-2 rounded-lg"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-center w-[10%]">
                    <Button
                      variant="destructive"
                      onClick={() => onRemoveMovie(movie.id)}
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
  );
}
