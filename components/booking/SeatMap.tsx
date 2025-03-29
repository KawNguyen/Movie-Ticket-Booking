import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Seat_Unselect from "../../public/Images/seat-unselect.png";
import Seat_Select from "../../public/Images/seat-select.png";
import Seat_Process from "../../public/Images/seat-process.png";
import Seat_Buy from "../../public/Images/seat-buy.png";
import Screen from "../../public/Images/ic-screen.png";

const seats = [
  ["A1", "A2", "A3", "A4", "A5", "A6"],
  ["B1", "B2", "B3", "B4", "B5", "B6"],
  ["C1", "C2", "C3", "C4", "C5", "C6"],
  ["D1", "D2", "D3", "D4", "D5", "D6"],
  ["E1", "E2", "E3", "E4", "E5", "E6"],
  ["F1", "F2", "F3", "F4", "F5", "F6"],
  ["G1", "G2", "G3", "G4", "G5", "G6"],
  ["H1", "H2", "H3", "H4", "H5", "H6"],
];

const SeatMap = () => {
  const getSeatImage = (seat: any) => {
    return Seat_Unselect;
  };

  return (
    <div className="w-full lg:w-3/4 mx-auto space-y-6">
      <div className="flex justify-between">
        {[
          { img: Seat_Unselect, label: "Empty Seat" },
          { img: Seat_Select, label: "Selected Seat" },
          { img: Seat_Process, label: "Reserved Seat" },
          { img: Seat_Buy, label: "Sold Seat" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Image 
              src={item.img} 
              alt={item.label} 
              width={40} 
              height={40}
              className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] md:w-[40px] md:h-[40px]" 
            />
            <span className="text-[10px] sm:text-xs font-medium text-center">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Image 
          alt="Screen" 
          className="w-3/4 sm:w-2/3 md:w-1/2" 
          src={Screen} 
        />
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-6 gap-2 w-fit">
          {seats.flat().map((seat) => (
            <Card
              key={seat}
              className="bg-muted/0 relative w-12 h-12 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity p-1"
            >
              <Image src={getSeatImage(seat)} alt={`Seat ${seat}`} width={40} height={40} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                {seat}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;