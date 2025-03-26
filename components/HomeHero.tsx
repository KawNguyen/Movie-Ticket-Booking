"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { useState } from "react";
import Link from "next/link";
import { DoorOpen } from "lucide-react";


interface HomeHeroProps {
  data: TopRatedMovie[];
}

const IMG_URL = "https://image.tmdb.org/t/p/w1920"

const HomeHero = ({ data }: HomeHeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const limitedItems = data.slice(0, 5);

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
              width={500} height={500}
              className={`w-full h-full transition duration-1000 relative ${activeIndex === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-125"
                }`}
            />
            <div
              className={`absolute top-0 bg-gradient-to-r from-black w-[44%] h-full`}
            >
              <div
                className={`absolute w-full h-full top-0 content-center xl:pl-20 pl-10 text-white transform transition-all duration-1000 ease-out  ${activeIndex === index
                  ? "translate-y-0 opacity-100"
                  : "translate-y-60 opacity-0"
                  }`}
              >
                <div className="flex w-full flex-col space-y-4">
                  <span className="font-bold xl:text-4xl lg:text-3xl md:text-2xl text-lg text-white">
                    {item.original_title}
                  </span>
                  <span className="xl:text-lg lg:text-base md:text-sm text-xs text-gray-600 hidden lg:block">
                    {item.release_date}
                  </span>
                  <span className="xl:text-lg lg:text-base md:text-sm text-xs text-gray-300 hidden lg:block">
                    {item.overview}
                  </span>
                  <Link
                    href={`/movie/${item.id}`}
                    className={`transform transition-all duration-1000 ease-out ${activeIndex === index
                      ? "opacity-100 delay-1000"
                      : "opacity-0"
                      }`}
                  >
                    <div
                      className={`relative bg-brand-800 px-2 py-0.5 rounded-xl border flex justify-between items-center space-x-2
                      w-fit md:text-lg text-xs text-white duration-300 hover:bg-brand-700 
                    `}
                    >
                      <p>More Info</p>
                      <DoorOpen size={20} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  )
}

export default HomeHero
