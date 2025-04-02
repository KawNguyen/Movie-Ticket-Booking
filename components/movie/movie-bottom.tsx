"use client";
import React from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const tabs = [
  { value: "trailer", label: "Trailer" },
  { value: "dienvien", label: "Cast" },
  { value: "showtimes", label: "Showtimes" },
  { value: "reviews", label: "Reviews" },
];

const MovieBottom: React.FC<DetailsProps> = ({ movie, cast }) => {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="trailer" className="w-full">
        <TabsList className="flex flex-wrap justify-center bg-black border-gray-700 space-x-2 sm:space-x-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-3 sm:px-4 py-2 text-gray-400 hover:text-blue-400 data-[state=active]:text-white text-sm sm:text-base"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Trailer Tab */}
        <TabsContent value="trailer">
          <div className="container mx-auto p-4 mt-4 md:mt-8">
            {movie.videos?.results.length > 0 ? (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-52 sm:h-72 md:h-96 lg:h-[600px] rounded-lg shadow-md"
                frameBorder="0"
                src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                title="YouTube video player"
              ></iframe>
            ) : (
              <div className="text-center text-gray-400 py-20">
                <Film className="mx-auto h-16 w-16 mb-4" />
                <p className="text-lg sm:text-xl">
                  No trailer found for this movie
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Cast Tab */}
        <TabsContent value="dienvien">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {cast.map((actor) => (
              <Card key={actor.id} className="bg-gray-800 text-white shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72">
                    <Image
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg"
                      }
                      alt={actor.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-center text-sm sm:text-base">
                    {actor.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Các tab khác */}
        {["showtimes", "reviews"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="p-4 text-gray-300 capitalize text-sm sm:text-base">
              {tab} coming soon...
            </div>
          </TabsContent>
        ))}

      </Tabs>
    </div>
  );
};

export default MovieBottom;
