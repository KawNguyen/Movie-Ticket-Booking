"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useMovieManagement } from "@/hooks/useMovieManagement";


const IMG_URL = "https://image.tmdb.org/t/p/w1920";

const HomeHero = ({ movies }: {movies : MovieCardProps[]}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const limitedItems = movies.slice(0, 5);
  const router = useRouter();

  return (  
    <Swiper
      spaceBetween={30}
      autoplay={{
        delay: 7000,
        disableOnInteraction: false,
      }}
      speed={1000}
      effect="fade"
      modules={[Autoplay, EffectFade]}
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      className="w-full md:h-screen"
    >
      {limitedItems.map((item: any, index: number) => {
        return (
          <SwiperSlide key={index} className="h-full w-full">
            <Image
              src={`${IMG_URL}/${item.backdrop_path}`}
              alt={`${IMG_URL}/${item.backdrop_path}`}
              width={500}
              height={100}
              className={`w-full h-full transition duration-1000 relative ${
                activeIndex === index
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-125"
              }`}
            />
            <div
              className={`absolute top-0 bg-gradient-to-r from-black w-[44%] h-full`}
            >
              <div
                className={`absolute w-full h-full top-0 content-center xl:pl-20 pl-10 text-white transform transition-all duration-1000 ease-out  ${
                  activeIndex === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-60 opacity-0"
                }`}
              >
                <div className="flex w-full flex-col space-y-4">
                  <span className="font-bold xl:text-4xl lg:text-3xl md:text-2xl text-lg text-white">
                    {item.title}
                  </span>
                  <span className="xl:text-lg lg:text-base md:text-sm text-xs text-gray-600 hidden lg:block">
                    {item.release_date}
                  </span>
                  <span className="xl:text-lg lg:text-base md:text-sm text-xs text-gray-300 hidden lg:block">
                    {item.overview}
                  </span>
                  <div
                    className={`transform transition-all duration-1000 ease-out ${
                      activeIndex === index
                        ? "opacity-100 delay-1000"
                        : "opacity-0"
                    }`}
                  >
                    <Button
                      variant="default"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => router.push(`/movie/${item.id}`)}
                    >
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HomeHero;
