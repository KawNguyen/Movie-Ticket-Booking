import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Metadata } from "next";

const TemplateHomePage = dynamic(() => import("@/components/templates/TemplateHomePage"), {
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  ),
  ssr: true
});

export const metadata: Metadata = {
  title: "Movie Ticket Booking - Your Ultimate Cinema Experience",
  description: "Book movie tickets online, browse now showing and upcoming movies, and enjoy exclusive deals for your favorite films.",
};

const HomePage = () => {    
    return (
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      }>
        <TemplateHomePage />
      </Suspense>
    );
};

export default HomePage;
