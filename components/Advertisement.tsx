import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

interface AdvertisementProp {
  src: string;
  content?: string;
  adv?: string;
  align?: "left" | "center" | "right";
  bgType?: "gradient" | "solid";
  textSize?: "sm" | "md" | "lg" | "xl"; // New prop for text size
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
    left: "items-start pl-10 text-left",
    center: "items-center text-center",
    right: "items-end pr-10 text-right",
  };

  const bgClasses =
    bgType === "gradient" ? "bg-gradient-to-r from-black" : "bg-black/80";

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  return (
    <AspectRatio ratio={16 / 5} className="w-full relative">
      <div
        className={`w-full h-full absolute ${bgClasses} flex flex-col justify-center pl-40 pr-40 ${alignmentClasses[align]}`}
      >
        <div className="w-[40%]">
          <span className={`${textSizeClasses[textSize]} font-bold`}>
            {content}
          </span>
        </div>
        {adv && (
          <div className="py-1 px-2 rounded-xl border-[1px] border-white w-max mt-4">
            {adv}
          </div>
        )}
      </div>

      {/* Background Image */}
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
