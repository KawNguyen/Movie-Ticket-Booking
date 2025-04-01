import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  imageUrl: string;
  purchaseDate: string;
  showDate: string;
  showTime: string;
  seatNumber: string;
  price: number;
  theater: string;
}

export const BookingHistory = () => {
  const watchedMovies: Movie[] = [
    {
      id: 1,
      title: "Avengers: Endgame",
      year: 2019,
      rating: 8.4,
      imageUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      purchaseDate: "2023-04-25",
      showDate: "2023-04-28",
      showTime: "19:30",
      seatNumber: "A12",
      price: 120000,
      theater: "CGV Vincom Center",
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      year: 2021,
      rating: 8.2,
      imageUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      purchaseDate: "2023-05-15",
      showDate: "2023-05-18",
      showTime: "20:00",
      seatNumber: "B7",
      price: 150000,
      theater: "CGV Crescent Mall",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Booking History</h2>
      <div className="space-y-4">
        {watchedMovies.map((movie) => (
          <Card key={movie.id} className="bg-gray-900 text-white">
            <CardContent className="p-4 flex">
              <div className="w-32 h-48 overflow-hidden rounded-lg">
                <Image
                  src={movie.imageUrl}
                  alt={movie.title}
                  height={480}
                  width={360}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-6 flex-1">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg">{movie.title}</CardTitle>
                </CardHeader>
                <div className="text-gray-400 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Purchase Date:</span>
                    <span>{movie.purchaseDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>{movie.price.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Show Date:</span>
                    <span>{movie.showDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Show Time:</span>
                    <span>{movie.showTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seat Number:</span>
                    <Badge variant="secondary">{movie.seatNumber}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Theater:</span>
                    <span>{movie.theater}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
