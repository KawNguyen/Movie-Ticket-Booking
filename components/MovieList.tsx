
import MovieCard from "./MovieCard";

const IMG_URL = "https://image.tmdb.org/t/p/w500"

interface MovieListProps {
    data: TopRatedMovie[];
}

const MovieList = ({ data }: MovieListProps) => {
    const limitedItems = data.slice(0, 5);
    return (
        <div className="w-fulll grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3  2xl:grid-cols-5 gap-6 place-items-center"> 
            {limitedItems?.map((item: any, index: number) => {
                return (
                    <MovieCard
                        key={item.id + index}
                        id={item.id}
                        title={item.title}
                        year={item.release_date}
                        rating={item.vote_average}
                        imageUrl={`${IMG_URL}/${item.poster_path}`}
                    />
                );
            })}
        </div>
    );
};

export default MovieList;
