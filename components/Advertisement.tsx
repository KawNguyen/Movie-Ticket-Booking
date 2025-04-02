import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";

interface AdvertisementProp {
  src: string;
  content?: string;
  adv?: string;
  align?: "left" | "center" | "right";
  bgType?: "gradient" | "solid";
  textSize?: "sm" | "md" | "lg" | "xl";
}

const Advertisement = ({
  src,
  content,
  adv,
  align = "left",
  bgType = "gradient",
  textSize = "lg",
}: AdvertisementProp) => {
  const alignmentClasses = {
    left: "items-start sm:pl-10 text-left",
    center: "items-center text-center",
    right: "items-end sm:pr-10 text-right",
  };

  const bgClasses =
    bgType === "gradient" ? "bg-gradient-to-r from-black/80" : "bg-black/80";

  const textSizeClasses = {
    sm: "text-sm sm:text-lg",
    md: "text-md sm:text-2xl",
    lg: "text-lg sm:text-4xl",
    xl: "text-xl sm:text-6xl",
  };

  return (
    <AspectRatio ratio={16 / 6} className="w-full relative">
      <div
        className={`w-full h-full absolute ${bgClasses} flex flex-col justify-center p-4 sm:p-10 lg:p-20 ${alignmentClasses[align]}`}
      >
        <div className="w-full sm:w-[60%] lg:w-[40%]">
          <span className={`font-bold ${textSizeClasses[textSize]}`}>
            {content}
          </span>
        </div>
        {adv && (
          <div className="py-1 px-3 rounded-xl border border-white w-max mt-4 text-sm sm:text-base lg:text-lg">
            {adv}
          </div>
        )}
      </div>

      <Image
        src={src}
        alt="advertisement"
        width={500}
        height={500}
        className="object-cover w-full h-full"
        unoptimized
      />
    </AspectRatio>
  );
};

export default Advertisement;
