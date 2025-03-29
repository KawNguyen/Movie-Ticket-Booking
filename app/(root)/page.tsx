import Advertisement from "@/components/Advertisement";
import Feedback from "@/components/Feedback";
import HomeHero from "@/components/HomeHero";
import RowContent from "@/components/RowContent";
import { fetchTmdbData } from "@/lib/tmdb";

const HomePage = async () => {
  const nowPlaying = await fetchTmdbData("movie/now_playing");

  return (
    <main className="w-full h-full space-y-10">
      <HomeHero status="Now Showing" />
      
      <div className="container space-y-10">
        <RowContent status="Now Showing" />
        <RowContent status="Coming Soon" />
      </div>

      <Advertisement
        src="https://di-uploads-pod6.dealerinspire.com/jaguarnewportbeach/uploads/2019/10/movie-theater-Depositphotos_5551251_xl-2015.jpg"
        content="One Epic Movie, One Epic Combo – Large Popcorn & Pepsi!"
        adv="Up To 20% OFF"
        align="left"
      />

      <Feedback data={nowPlaying.results} />

      <Advertisement
        src="https://pro.sony/s3/2017/04/08151948/main-banner_1600x450.jpg"
        content="Step into a world of cinematic adventure with our seamless movie ticket booking platform – where you can browse the latest blockbusters, secure the best seats in just a few clicks, skip the hassle of long lines, and enjoy exclusive deals, all while experiencing the magic of the big screen like never before – because great movies deserve a great booking experience!"
        align="center"
        bgType="solid"
        textSize="sm"
      />
    </main>
  );
};

export default HomePage;
