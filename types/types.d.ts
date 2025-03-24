interface AuthCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface TopRatedMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieCardProps {
  id: string;
  title: string;
  year: string;
  rating: number;
  imageUrl: string;
}
interface DetailsProps {
  movie: any;
  cast: Array<{ id: number; name: string; profile_path: string | null }>;
  // movie: {
  //   videos?: {
  //     results: { key: string }[];
  //   };
  // };
  // cast: {
  //   id: number;
  //   name: string;
  //   profile_path: string | null;
  // }[];
}
