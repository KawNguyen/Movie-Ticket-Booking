"use client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function MovieCard({
  id,
  title,
  year="",
  rating=0,
  imageUrl,
  duration,
}: MovieCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-4 flex flex-col group hover:scale-105 transition-transform duration-300">
      <AspectRatio
        ratio={2/3}
        className="relative w-full overflow-hidden rounded-lg bg-gray-800"
      >
        <Image
          src={imageError ? '/fallback-movie-poster.jpg' : imageUrl}
          alt={`${title} movie poster`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-75"
          priority={true}
          onError={() => setImageError(true)}
        />
      </AspectRatio>

      <div className="mt-3 flex-grow">
        <h2 className="font-semibold line-clamp-1" title={title}>{title}</h2>
        <div className="flex gap-2 text-gray-400 text-sm">
          <span>{year}</span>
          <span>•</span>
          <span>{duration} min</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="default"
          className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          onClick={() => router.push(`/movie/${id}`)}
        >
          More Info
        </Button>

        <div className="flex items-center bg-gray-800/50 px-2 py-1 rounded">
          <Star color="yellow" fill="yellow" size={16} />
          <span className="ml-1 text-white font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
