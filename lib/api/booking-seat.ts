import axios from "axios";

export const getBookingSeatsByShowtime = async (showtimeId: number) => {
  try {
    const response = await axios.get(`/api/bookingseats`, {
      params: { showtimeId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
