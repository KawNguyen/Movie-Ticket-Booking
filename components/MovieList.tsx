
import MovieCard from "./MovieCard";

const IMG_URL = "https://image.tmdb.org/t/p/w500"

interface MovieListProps {
    data: TopRatedMovie[];
}

const MovieList = ({ data }: MovieListProps) => {
    const limitedItems = data.slice(0, 5);
    return (
        <div className="w-fulll grid grid-cols-5 gap-10 place-items-center"> 
            {limitedItems?.map((item: any, index: number) => {
                return (
                    <MovieCard
                        key={item.id + index}
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
