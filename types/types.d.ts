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

interface NavItem {
  name: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems?: NavItem[];
  setActiveTab?: (tabName: string) => void;
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
  id: number;
  title: string;
  year: string;
  rating: number;
  duration: number;
  imageUrl: string;
  isLoading?: boolean;
  status?: string;
}

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string;
  release_date: string;
  overview: string;
  status?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  vote_average?: number;
}

interface MovieListProps {
  data: MovieCardProps[];
  isLoading?: boolean;
  limit?: number;
}

interface ScreeningRoom {
  id: number;
  name: string;
  capacity: number;
  showtimes?: {
    id: number;
    startTime: string;
    movie: {
      id: number;
      title: string;
    };
    price: number;
    bookedSeats: number;
  }[];
}

interface Showtime {
  id: number;
  movieId: number;
  movie: Movie;
  screeningRoomId: number;
  screeningRoom: ScreeningRoom;
  date: string;
  time: string;
  price: number;
}

interface Seat {
  id: number;
  row: string;
  number: number;
  bookingSeats: Array<{
    id: number;
    status: string;
  }>;
}

interface BookingSeat {
  id: number;
  seatId: number;
  status: 'AVAILABLE' | 'PENDING' | 'BOOKED';
  bookingId: number;
  showtimeId: number;
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
interface booking {
  seat: any;
}
