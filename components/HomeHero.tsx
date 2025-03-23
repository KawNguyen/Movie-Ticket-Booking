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
      centeredSlides={true}
      autoplay={{
        delay: 7000,
        disableOnInteraction: false,
      }}
      speed={1100}
      effect="fade"
      modules={[Autoplay, EffectFade]}
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      className="w-full "
    >
      {limitedItems.map((item: any, index: number) => {
        return (
          <SwiperSlide key={index}>
            <Image
              src={`${IMG_URL}/${item.backdrop_path}`}
              alt={`${IMG_URL}/${item.backdrop_path}`}
              width={500} height={500}
              className={`w-full transition duration-1300 relative ${activeIndex === index
                ? "opacity-100 scale-100"
                : "opacity-0 scale-125"
                }`}
            />
            <div
              className={`absolute top-0 bg-gradient-to-r from-black w-[44%] h-full`}
            >
              <div
                className={`absolute w-full h-full top-0 content-center xl:pl-20 pl-10 text-white transform transition-all duration-[1300ms] ease-out  ${activeIndex === index
                  ? "translate-y-0 opacity-100"
                  : "translate-y-60 opacity-0"
                  }`}
              >
                <div className="flex w-full flex-col space-y-4">
                  <span className="font-bold xl:text-4xl lg:text-3xl md:text-2xl text-lg text-white">
                    {item.original_title}
                  </span>
                  <span>
                    {item.overview}
                  </span>
                  <Link
                    href={``}
                    className={`transform transition-all duration-1000 ease-out ${activeIndex === index
                      ? "opacity-100 delay-[1200ms]"
                      : "opacity-0"
                      }`}
                  >
                    <div
                      className={`relative bg-brand-800 md:p-2 p-1 rounded-md border flex justify-between items-center space-x-1
                      w-fit md:text-xl text-xs font-bold text-white duration-300 hover:bg-brand-700 
                      overflow-hidden
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
