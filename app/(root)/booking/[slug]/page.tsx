import React from "react";
import SeatMap from "@/components/booking/SeatMap";
import MovieInfo from "@/components/booking/MovieInfo";

const Page = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <SeatMap />
          <MovieInfo />
        </div>
      </div>
    </div>
  );
};

export default Page;
