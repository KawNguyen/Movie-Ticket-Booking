import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

interface UseSocketProps {
  selectedShowTime: Showtime | null;
  setPendingSeats: (callback: (prev: string[]) => string[]) => void;
}

export const useSocket = ({ selectedShowTime, setPendingSeats }: UseSocketProps) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io({
      path: "/api/socket",
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on(
      "seat-selected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          console.log(`Seat ${seatId} has been selected (showtime: ${showtimeId})`);
          setPendingSeats((prev) => [...new Set([...prev, seatId])]);
        }
      }
    );

    socketRef.current.on(
      "seat-unselected",
      ({ seatId, showtimeId }: { seatId: string; showtimeId: number }) => {
        if (selectedShowTime?.id === showtimeId) {
          console.log(`Seat ${seatId} has been unselected`);
          setPendingSeats((prev) => prev.filter((id) => id !== seatId));
        }
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedShowTime, setPendingSeats]);

  return socketRef;
};