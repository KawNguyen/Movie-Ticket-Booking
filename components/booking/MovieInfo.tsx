import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieInfo = ({ data }: { data: Movie }) => {
  console.log(data);
  return (
    <div className="w-full lg:w-1/4">
      <Card className="max-w-xs mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-start">
          <div className="relative">
            <Image
              alt="Movie poster showing a group of people in a dramatic scene"
              className="w-24 h-36 rounded-lg"
              src={`${IMG_URL}/${data?.poster_path}`}
              width={96}
              height={144}
              priority
              unoptimized
            />
            <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
              T18
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-lg font-bold text-blue-400">{data.title}</h1>
            <p className="text-gray-400">
              {data.genres?.map((genre) => genre.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Genre</span>
            <span className="text-white">Horror</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Duration</span>
            <span className="text-white">122 minutes</span>
          </div>
          <Separator className="my-2 bg-gray-600" />
          <div className="flex justify-between text-gray-400">
            <span>Cinema</span>
            <span className="text-white">Beta Thai Nguyen</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Show Date</span>
            <span className="text-white">03/29/2025</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Show Time</span>
            <span className="text-white">20:20</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Theater</span>
            <span className="text-white">P4</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Seat</span>
            <span className="text-white">---</span>
          </div>
          <Card className="p-3 rounded-lg bg-gray-700 flex justify-between">
            <div>
              <div className="text-gray-400 text-sm">Total Price</div>
              <div className="text-blue-400 font-bold text-xl">$10.00</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Time Remaining</div>
              <div className="text-yellow-400 font-bold text-xl">07:52</div>
            </div>
          </Card>
          <Button className="w-full bg-blue-500 text-white py-1.5 font-bold hover:bg-blue-600 transition duration-300">
            CONTINUE
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MovieInfo;
