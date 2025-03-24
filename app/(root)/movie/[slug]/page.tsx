
import Top from "@/components/movie/movie-top";
import Bottom from "@/components/movie/movie-bottom";
import { fetchTmdbDetail } from "@/lib/tmdb";

const Page = async ({ params }: { params: { slug: string } }) => {
  const movieId = params.slug;
  const data = await fetchTmdbDetail(movieId);
  return (
    <div className="bg-black text-white min-h-screen">
      <Top movie={data}  cast={data.credits?.cast.slice() || []}/>
      <Bottom movie={data} cast={data.credits?.cast.slice() || []}/>
    </div>
  );
}

export default Page;
