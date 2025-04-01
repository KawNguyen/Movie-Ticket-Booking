import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "./ui/aspect-ratio";

export default function SkeletonCard() {
  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-4 flex flex-col">
      <AspectRatio
        ratio={2/3}
        className="relative w-full overflow-hidden rounded-lg bg-gray-800"
      >
        <Skeleton className="absolute inset-0 bg-gray-800" />
      </AspectRatio>

      <div className="mt-3 flex-grow">
        <Skeleton className="h-6 w-3/4 bg-gray-800 mb-2" />
        <Skeleton className="h-4 w-1/2 bg-gray-800" />
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-9 w-24 bg-gray-800" />
        <Skeleton className="h-7 w-12 bg-gray-800" />
      </div>
    </div>
  );
}