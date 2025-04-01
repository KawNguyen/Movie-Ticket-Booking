"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import HomeHero from "../HomeHero";
import MovieList from "../MovieList";
import Advertisement from "../Advertisement";
import Feedback from "../Feedback";
import { MovieService } from "@/services/movie.service";

const TemplateHomePage = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState<MovieCardProps[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<MovieCardProps[]>([]);

  const fetchMovies = useCallback(async () => {
    try {
      const ns = await MovieService.getAllMoviesByStatus("Now Showing");
      const cs = await MovieService.getAllMoviesByStatus("Coming Soon");
      setNowShowingMovies(ns as MovieCardProps[]);
      setComingSoonMovies(cs as MovieCardProps[]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }, []);

  useEffect(() => {
    console.log("a")
    fetchMovies();
  }, [fetchMovies]);

  return (
    <main className="w-full h-full space-y-10">
      <HomeHero movies={nowShowingMovies} />
        
        <div className="container space-y-10">
          <section aria-label="Now Showing Movies">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Now Showing</h2>
              <Link href="/now-showing" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">
                View All
              </Link>
            </div>
            <MovieList movies={nowShowingMovies as MovieCardProps[]} />
          </section>
        
          <section aria-label="Coming Soon Movies">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <Link href="/coming-soon" className="text-blue-500 hover:text-blue-400 transition-colors duration-200">
                View All
              </Link>
            </div>
            <MovieList movies={comingSoonMovies as MovieCardProps[]} />
          </section>
        </div>

        <Advertisement
          src="https://di-uploads-pod6.dealerinspire.com/jaguarnewportbeach/uploads/2019/10/movie-theater-Depositphotos_5551251_xl-2015.jpg"
          content="One Epic Movie, One Epic Combo – Large Popcorn & Pepsi!"
          adv="Up To 20% OFF"
          align="left"
        />

        <Feedback movies={nowShowingMovies as any[]}/>

        <Advertisement
          src="https://pro.sony/s3/2017/04/08151948/main-banner_1600x450.jpg"
          content="Step into a world of cinematic adventure with our seamless movie ticket booking platform – where you can browse the latest blockbusters, secure the best seats in just a few clicks, skip the hassle of long lines, and enjoy exclusive deals, all while experiencing the magic of the big screen like never before – because great movies deserve a great booking experience!"
          align="center"
          bgType="solid"
          textSize="sm"
        />
      </main>
  )
};

export default TemplateHomePage;
