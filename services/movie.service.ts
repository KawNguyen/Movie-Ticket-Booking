import { getMovies, getMoviesByStatus, addMovie, deleteMovie, updateMovieStatus } from '@/lib/api/movies';

export class MovieService {
  static async getAllMoviesByStatus(status: string) {
    try {
      return await getMoviesByStatus(status);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  static async getAllMovies() {
    try {
      return await getMovies();
    } catch (error) {
      console.error('Error fetching movie:', error);
      return null;
    }
  }

  static async addMovie(movieData: any) {
    try {
      const transformedData = {
        title: movieData.title,
        overview: movieData.overview,
        poster_path: movieData.poster_path,
        backdrop_path: movieData.backdrop_path,
        release_date: movieData.release_date,
        runtime: movieData.runtime,
        vote_average: movieData.vote_average,
        genres: movieData.genres,
        status: movieData.status
      };
      return await addMovie({ id: movieData.id, ...transformedData });
    } catch (error) {
      console.error('Error adding movie:', error);
      throw error;
    }
  }

  static async deleteMovie(id: number) {
    try {
      return await deleteMovie(id);
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }

  static async updateMovieStatus(id: number, status: string) {
    try {
      return await updateMovieStatus(id, status);
    } catch (error) {
      console.error('Error updating movie status:', error);
      throw error;
    }
  }
}