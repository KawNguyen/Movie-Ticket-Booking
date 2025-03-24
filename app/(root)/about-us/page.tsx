"use client"
import { Autoplay, Pagination } from 'swiper/modules';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const AboutUsPage = () => {
    return (
        <div className="space-y-20 mb-20">
            <div className="relative">
                <img
                    src="https://i.pinimg.com/736x/cf/c5/82/cfc58298514581ecbb82dce74f1bfa58.jpg"
                    alt="about_us"
                    className="w-full h-[300px] md:h-[500px] lg:h-[800px] object-cover"
                />
                <div className="absolute top-0 w-full h-32 md:h-60 flex flex-col items-center justify-center text-white">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.3em]">
                        About Us
                    </h1>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full md:h-[500px] m-4 md:m-10">
                <div className="col-span-8">
                    <div className="relative bg-[url('https://i.pinimg.com/736x/88/ce/50/88ce50ed47ab29d969d91492a98d6d41.jpg')] bg-cover bg-center rounded-lg h-[300px] md:h-full">
                        <Swiper
                            loop={true}
                            autoplay={{
                                delay: 3000, // Thời gian giữa các slide, tính bằng ms (3000ms = 3s)
                                disableOnInteraction: false, // Vẫn tiếp tục autoplay ngay cả khi người dùng tương tác
                            }}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            modules={[Pagination,Autoplay]}
                            className="h-full"
                        >
                            <SwiperSlide>
                                <div className="flex items-center justify-center h-28 md:h-20 text-black text-xl md:text-4xl font-bold">
                                    <h1 className='tracking-[0.3em]'>About Us</h1>
                                </div>
                                <div className="flex items-center justify-center h-10 md:h-60 px-4">
                                    <p className="text-black text-[12px] md:text-xl font-bold text-center max-w-[calc(100%-60px)] md:max-w-[calc(100%-280px)] md:mr-6">
                                        Welcome to [Your Cinema Name]! At [Your Cinema Name], we bring the magic of cinema closer to you.
                                        From the latest Hollywood blockbusters to beloved classics, we provide a seamless ticket booking experience,
                                        ensuring your movie nights are always special.
                                    </p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="flex items-center justify-center h-28 md:h-20 text-black text-xl md:text-4xl font-bold">
                                    <h1 className='tracking-[0.3em]'>Our Offer</h1>
                                </div>
                                <div className="flex items-center justify-center h-10 md:h-60 px-4">
                                    <ul className="text-black text-[12px] md:text-xl font-bold text-center max-w-[calc(100%-80px)] overflow-y-scroll md:overflow-hidden md:max-w-[calc(100%-160px)] md:space-y-2">
                                        <p>Latest Movie Releases: Stay updated with the hottest films and exclusive premieres.</p>
                                        <p>Exclusive Discounts: Enjoy special promotions and deals on tickets and combos.</p>
                                        <p>Flexible Booking: Select your preferred seats and showtimes with ease.</p>
                                        {/* <p>Catering to All: Experience 2D, 3D, and IMAX movies at their best.</p> */}
                                    </ul>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="flex items-center justify-center h-28 md:h-20 text-black text-xl md:text-4xl font-bold">
                                    <h1 className='tracking-[0.3em]'>Our Vision</h1>
                                </div>
                                <div className="flex items-center justify-center h-10 md:h-60 px-4">
                                    <p className="text-black text-[12px] md:text-xl font-bold text-center max-w-[calc(100%-80px)] md:max-w-[calc(100%-300px)] md:mr-6">
                                        At [Your Cinema Name], we believe in creating a world where everyone can experience the joy of cinema.
                                        Our vision is to provide a platform that not only makes ticket booking simple and fast but also enhances the
                                        way people connect with movies and unforgettable cinematic experiences.
                                    </p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <div className="hidden md:col-span-4 md:flex md:justify-center md:items-center">
                    <img
                        src="https://i.pinimg.com/736x/33/c1/ef/33c1ef54b6e934505767c7d7d50a5bd3.jpg"
                        alt="about_us_image"
                        className="w-full h-full  md:h-full max-w-[500px] rounded-md object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
