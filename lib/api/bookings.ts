import axios from "axios";

export const getBookingsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`/api/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};