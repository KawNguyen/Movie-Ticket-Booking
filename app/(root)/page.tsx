import { Metadata } from "next";
import TemplateHomePage from "@/components/homepage/TemplateHomePage";

export const metadata: Metadata = {
  title: "Movie Ticket Booking - Your Ultimate Cinema Experience",
  description: "Book movie tickets online, browse now showing and upcoming movies, and enjoy exclusive deals for your favorite films.",
};

const HomePage = () => {    

    return (
      <TemplateHomePage/>
    );
};

export default HomePage;
