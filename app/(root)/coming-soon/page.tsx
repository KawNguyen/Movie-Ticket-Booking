import { Metadata } from "next";
import TemplateMoviesByStatus from "@/components/templates/TemplateMoviesByStatus";

export const metadata: Metadata = {
  title: "Coming Soon - Movie Ticket Booking",
  description: "Browse upcoming movies in theaters",
};

const ComingSoon = async () => {
  return <TemplateMoviesByStatus status="Coming Soon" />;
};

export default ComingSoon;
