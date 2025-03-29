"use client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { useRouter } from "next/navigation";

export default function MovieCard({
  id,
  title,
  year,
  rating,
  imageUrl,
  duration,
}: MovieCardProps) {
  const router = useRouter();
  return (
    <div className="lg:w-64 w-48 bg-gray-900 text-white rounded-2xl shadow-lg p-4 flex flex-col">
      <AspectRatio
        ratio={1}
        className="relative w-full overflow-hidden rounded-lg"
      >
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </AspectRatio>

      <div className="mt-3 grid-cols-subgrid">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex gap-2">
          <h3 className="text-gray-400 text-sm">{year}</h3>
          <p className="text-gray-400 text-sm">{duration} min</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 ">
        <Button
          variant="default"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => router.push(`/movie/${id}`)}
        >
          More Info
        </Button>

        <div className="flex items-center">
          <Star color="yellow" fill="yellow" size={16} />
          <span className="ml-1 text-white font-medium">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
