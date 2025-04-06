import axios from "axios";

export interface Seat {
  id: number;
  row: string;
  number: number;
  screeningRoomId: number;
  bookingSeats: Array<{
    id: number;
    seatId?: number;
    status: "AVAILABLE" | "PENDING" | "BOOKED";
    bookingId?: number;
    showtimeId?: number;
    userId: string;
  }>;
}

export const getSeatsByRoom = async (
  roomId: number,
  showtimeId: number,
): Promise<Seat[]> => {
  try {
    const response = await axios.get(`/api/seats/${roomId}`, {
      headers: {
        "showtime-id": showtimeId.toString(),
      },
    });
    return response.data as Seat[];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch seats");
  }
};

export const getBookedSeats = async (showtimeId: number) => {
  try {
    const response = await axios.get(`/api/booking-seats/${showtimeId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch booked seats",
    );
  }
};
