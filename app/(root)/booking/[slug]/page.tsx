"use client"

import { useEffect, useState } from "react";
import Booking from "@/components/booking/Booking";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { getMovieById } from "@/lib/api/movies";
import { useParams } from "next/navigation";

function BookingPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [movie, setMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(slug);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-black/95 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-black/95 flex items-center justify-center">
      <p className="text-white">Movie not found</p>
    </div>;
  }

  return (
    <main className="min-h-screen bg-black/95">
      <div className="container mx-auto py-8">
        {/* Movie Ticket Info Card */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex gap-6">
            {/* Movie Poster */}
            <div className="relative h-[300px] w-[200px] rounded-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w500${(movie as any).poster_path}`}
                alt={(movie as any).title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl font-bold text-white">{(movie as any).title}</h1>
              
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{(movie as any).runtime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{(movie as any).release_date}</span>
                </div>
              </div>

              <p className="text-gray-400 line-clamp-3">{(movie as any).overview}</p>

              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="block text-gray-500">Movie Rating</span>
                    <span>{(movie as any).vote_average?.toFixed(1)} / 10</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Status</span>
                    <span>{(movie as any).status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Booking Component */}
        <Booking slug={slug} />

      </div>
    </main>
  );
}

export default BookingPage;