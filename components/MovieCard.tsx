import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Star } from "lucide-react";
import Image from "next/image";

export default function MovieCard({
  title,
  year,
  rating,
  imageUrl,
}: MovieCardProps) {
  return (
    <div className="w-64 bg-gray-900 text-white rounded-2xl shadow-lg p-4 flex flex-col justify-between">
      {/* Movie Poster */}
      <AspectRatio ratio={1} className="relative w-full h-48 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </AspectRatio>

      {/* Movie Info */}
      <div className="mt-3">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-gray-400 text-sm">
          {year}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center mt-4 ">
        <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
          Get Ticket
        </Button>

        {/* Rating */}
        <div className="flex items-center">
          <Star color="yellow" fill="yellow" size={16} />
          <span className="ml-1 text-white font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
