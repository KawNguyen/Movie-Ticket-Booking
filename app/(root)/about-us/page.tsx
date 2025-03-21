import { Mail, Phone } from 'lucide-react'
import React from 'react'

const AboutUsPage = () => {
    return (
        <div>
            <div className="my-10 sm:my-20 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 container mx-auto gap-6">
                    <div className="p-4">
                        <img
                            src="https://i.pinimg.com/736x/a3/f4/10/a3f4109aba040cefc6def1ed137869ab.jpg"
                            alt="about_us"
                            className="w-full sm:h-[300px] md:h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-2xl sm:text-3xl font-bold py-4">ABOUT KLLL</p>
                        <p className="text-sm sm:text-base md:text-2xl py-4">
                            Welcome to our Movie Ticket Booking platform! We are dedicated to making your movie experience smooth,
                            convenient, and enjoyable. Our mission is to provide a user-friendly platform where you can explore the latest films,
                            check showtimes, and book your tickets effortlessly. With secure payment options and real-time seat selection,
                            we ensure that you get the best seats for your favorite movies. Whether you're planning a fun outing with friends
                            or a cozy movie night with family, we are here to make it hassle-free. Thank you for choosing us as your trusted movie booking partner!
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 container mx-auto gap-6 pt-10">
                    <div className="text-center sm:text-left">
                        <p className="text-2xl sm:text-3xl font-bold py-4">Our Mission</p>
                        <p className="text-sm sm:text-base md:text-2xl">
                            Our mission is to revolutionize the movie-going experience by providing a seamless, reliable, and user-friendly platform
                            for booking tickets. We aim to save time, reduce hassle, and enhance convenience by offering real-time seat selection,
                            secure payment options, and up-to-date information on the latest movies and showtimes. Through innovation and customer focus,
                            we strive to make every movie experience enjoyable and stress-free for our users.
                        </p>
                    </div>
                    <div className="p-4">
                        <img
                            src="https://i.pinimg.com/736x/9c/17/59/9c17594c5352b591761f9c17bf8e0ee7.jpg"
                            alt="about_us"
                            className="w-full sm:h-[300px] md:h-full object-cover rounded-lg"
                        />
                    </div>
                </div>

                {/* Vision */}
                <div className="grid grid-cols-1 sm:grid-cols-2 container mx-auto gap-6">
                    <div className="p-4">
                        <img
                            src="https://i.pinimg.com/736x/6f/b9/b7/6fb9b70e7dd86c9bba5b32231166f42d.jpg"
                            alt="about_us"
                            className="w-full sm:h-[300px] md:h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-2xl sm:text-3xl font-bold py-4">Our Vision</p>
                        <p className="text-sm sm:text-base md:text-2xl">
                            Our vision is to become the leading platform for movie ticket bookings, transforming how people experience cinema.
                            We aspire to connect movie lovers with theaters worldwide, offering cutting-edge technology, personalized recommendations,
                            and seamless integration with entertainment services. By fostering convenience, innovation, and accessibility,
                            we aim to create a future where everyone can enjoy the magic of movies with just a few clicks.
                        </p>
                    </div>
                </div>
                <div className="container grid grid-cols-1 sm:grid-cols-2 py-10 gap-6 text-xl">
                    <div>
                        <p className="text-center sm:text-left text-2xl sm:text-2xl font-bold">
                            KLLL CINEMA
                        </p>
                        <p className="py-4 text-center sm:text-left">
                            GET IN TOUCH! WE'D LIKE TO HEAR FROM YOU.
                        </p>
                        <div className="py-6 text-center sm:text-left">
                            <p className="italic">@KLLL INC</p>
                            <p>180 Cao Lo Street, Ward 4, District 8, Vietnam</p>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start text-sm sm:text-lg py-2">
                            <Phone size={20} />
                            <p>Phone Number:</p>
                            <p className="text-base sm:text-xl">
                                +84 792039633 || +84 708672018 || 
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start text-sm sm:text-lg py-2">
                            <Mail size={24} />
                            <p>Mail:</p>
                            <p className="text-lg text-center">
                                tranhailoc7@gmail.com khoanguyencool12@gmail.com
                            </p>
                        </div>
                    </div>
                    <div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.2719686863547!2d106.67529067436607!3d10.738028859902176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fad027e3727%3A0x2a77b414e887f86d!2zMTgwIMSQLiBDYW8gTOG7lywgUGjGsOG7nW5nIDQsIFF14bqtbiA4LCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e1!3m2!1sen!2s!4v1732634649738!5m2!1sen!2s"
                            width="100%"
                            height="400"
                            className="border-0"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUsPage