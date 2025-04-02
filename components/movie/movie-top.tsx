"use client";
import React from "react";
import Image from "next/image";
import { ThumbsUp, Star, Ticket, Heart, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const MovieTop: React.FC<DetailsProps> = ({ movie, cast }) => {
  const router = useRouter();
  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-full">
        <Image
          alt={movie?.title || "Movie poster"}
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>

      {/* Nội dung chính */}
      <div className="relative container mx-auto p-4">
        <Card className="bg-gray-900/80 shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center">
          {/* Poster phim */}
          <div className="relative md:h-[400px] md:w-[300px] w-60 h-[80]">
            <Image
              alt={movie.title}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              height={400}
              width={300}
              className="object-fit rounded-lg"
            />
          </div>

          {/* Thông tin phim */}
          <CardContent className="w-full px-2 lg:px-6 mt-4 lg:mt-0">
            <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
            <p className="text-gray-400">
              {movie.genres.map((g: { name: string }) => g.name).join(", ")}
            </p>

            {/* Các nút hành động */}
            <div className="flex items-center space-x-2 mt-3">
              <Button variant="outline">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="secondary">
                <Star className="mr-2 h-4 w-4" />
                Rate
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600"
                onClick={()=>router.push(`/booking/${movie.id}`)}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Book Tickets
              </Button>
            </div>

            {/* Mô tả phim */}
            <p className="mt-4 text-gray-300">{movie.overview}</p>

            {/* Badge hiển thị thông tin phim */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">
                <Heart className="h-4 w-4 mr-1" />
                {(movie.vote_average * 10).toFixed(2)}%
              </Badge>
              <Badge>
                <Calendar className="h-4 w-4 mr-1" />
                {movie.release_date}
              </Badge>
              <Badge variant="outline" className="text-white">
                <Clock className="h-4 w-4 mr-1" />
                {movie.runtime} minutes
              </Badge>
            </div>

            {/* Diễn viên */}
            <div className="mt-4">
              <p className="text-gray-400">Cast</p>
              <p className="text-white">
                {cast?.map((actor) => actor.name).join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MovieTop;
