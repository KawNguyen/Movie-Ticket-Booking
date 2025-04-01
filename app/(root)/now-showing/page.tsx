import TemplateMoviesByStatus from "@/components/templates/TemplateMoviesByStatus";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now Showing - Movie Ticket Booking",
  description: "Browse all movies currently showing in theaters",
};

const NowShowing = async () => {
  return (
    <TemplateMoviesByStatus status="Now Showing"/>
  );
};

export default NowShowing;
