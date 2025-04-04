"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Armchair } from "lucide-react";
import { getShowtimesByMovieId } from "@/lib/api/showtimes";
import { getSeatsByRoom } from "@/lib/api/seats";
import { useToast } from "@/hooks/use-toast";
import { getBookingSeatsByShowtime} from "@/lib/api/booking-seat";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const COLUMNS = Array.from({ length: 8 }, (_, i) => i + 1);

const Booking = ({ slug }: { slug: string }) => {
  const { toast } = useToast();
  const [showTimes, setShowTimes] = useState<Showtime[]>([]);
  const [selectedShowTime, setSelectedShowTime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  useEffect(() => {
    const fetchShowTimes = async () => {
      if (slug) {
        try {
          const times = await getShowtimesByMovieId(slug);
          setShowTimes(times as Showtime[]);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load showtimes",
            variant: "destructive",
          });
        }
      }
    };
    fetchShowTimes();
  }, [slug]);

  const handleShowtimeSelect = async (time: Showtime) => {
    setSelectedShowTime(time);
    setIsLoadingSeats(true);
    try {
      const [seatsData, bookingSeats] = await Promise.all([
        getSeatsByRoom(time.screeningRoomId, time.id),
        getBookingSeatsByShowtime(time.id)
      ]);
  
      const updatedSeats = seatsData.map(seat => ({
        ...seat,
        bookingSeats: (bookingSeats as BookingSeat[]).filter(bs => bs.seatId === seat.id)
      }));
  
      setSeats(updatedSeats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load seats",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSeats(false);
    }
  };


  const handleSeatSelect = async (seat: Seat) => {
    const seatId = `${seat.row}${seat.number}`;
    
    try {
      if (selectedSeats.includes(seatId)) {
        // Delete the booking seat when unselecting
        setSelectedSeats(prev => prev.filter(id => id !== seatId));
      } else {
        setSelectedSeats(prev => [...prev, seatId]);
      }
  
      const [_, bookingSeats] = await Promise.all([
        getSeatsByRoom(selectedShowTime!.screeningRoomId, selectedShowTime!.id),
        getBookingSeatsByShowtime(selectedShowTime!.id)
      ]);
  
      setSeats(prev => prev.map(s => ({
        ...s,
        bookingSeats: (bookingSeats as BookingSeat[]).filter(bs => bs.seatId === s.id)
      })));
    } catch (error: any) {
      console.error("[SEAT_SELECTION_ERROR]", error?.message || error);
      toast({
        title: "Error",
        description: "Failed to update seat selection",
        variant: "destructive",
      });
    }
  };


  // Update the return statement to show both sections
  return (
    <div className="space-y-8">
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Select Showtime
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {showTimes.map((time) => (
            <Card
              key={time.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedShowTime?.id === time.id
                  ? "bg-black border-2 border-brand"
                  : "bg-black/40 hover:bg-black/60 border border-white/10"
              }`}
              onClick={() => handleShowtimeSelect(time)}
            >
              <div className="flex flex-col space-y-4 text-white">
                <div className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${
                    selectedShowTime?.id === time.id ? 'text-brand' : 'text-white/70'
                  }`} />
                  <span className="text-sm">
                    {new Date(time.date).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${
                    selectedShowTime?.id === time.id ? 'text-brand' : 'text-white/70'
                  }`} />
                  <span className="text-sm">{time.time}</span>
                </div>
                <div className="text-sm text-white/70">
                  Price: ${time.price}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
  
      {selectedShowTime && (
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Select Seats</h2>
          {isLoadingSeats ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-full bg-gray-700/50 p-8 rounded-lg text-center mb-12 border border-brand/20">
                  <p className="text-brand text-lg font-semibold">SCREEN</p>
                </div>
  
                <div className="flex flex-col items-center gap-8">
                  {/* Seats Grid */}
                  <div className="grid grid-cols-8 gap-2 max-w-2xl w-full">
                    {ROWS.map((row) => (
                      COLUMNS.map((seatNumber) => {
                        const seat = seats.find(s => s.row === row && s.number === seatNumber);
                        const seatId = seat ? `${row}${seatNumber}` : '';
                        
                        return (
                          <div
                            key={seatId}
                            onClick={() => seat && !seat.bookingSeats?.some(bs => bs.status === 'BOOKED' || bs.status === 'PENDING') && handleSeatSelect(seat)}
                            className={`
                              cursor-pointer flex flex-col items-center gap-1 transition-all duration-200
                              ${!seat ? 'invisible' : ''}
                              ${seat && !seat.bookingSeats?.some(bs => bs.status === 'BOOKED' || bs.status === 'PENDING') ? 'hover:text-green-500' : ''}
                            `}
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Armchair size={36} className={` transition-colors duration-200 hover:text-green-500 ${
                                      !seat ? 'invisible' :
                                      seat.bookingSeats?.some(bs => bs.status === 'BOOKED')
                                        ? 'text-red-500' 
                                        : seat.bookingSeats?.some(bs => bs.status === 'PENDING')
                                          ? 'text-yellow-500'
                                          : selectedSeats.includes(seatId)
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                    }`} />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{seat ? `Seat ${seatId}` : ''}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-xs text-gray-400">{seatId}</span>
                          </div>
                        );
                      })
                    ))}
                  </div>
  
                  {/* Legend continues... */}
                  <div className="flex gap-6 mt-8">
                    {[
                      { color: 'bg-gray-200', text: 'Available' },
                      { color: 'bg-green-500', text: 'Selected' },
                      { color: 'bg-red-500', text: 'Booked' },
                      { color: 'bg-yellow-500/50', text: 'Being Selected' }
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-2">
                        <Badge variant="outline" className={`${item.color} w-6 h-6 p-0`} />
                        <span className="text-gray-300">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
  
              {selectedSeats.length > 0 && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Selected Seats:</h3>
                      <div className="flex gap-2">
                        {selectedSeats.map((seatId) => (
                          <span key={seatId} className="bg-brand/20 text-brand px-2 py-1 rounded">
                            {seatId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 mb-2">Total Price</p>
                      <p className="text-2xl font-bold text-white">
                        ${(selectedSeats.length * (selectedShowTime?.price || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Booking;
