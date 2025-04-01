import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="container my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div>
          <Image
            src="https://www.courier-journal.com/gcdn/presto/2019/04/02/PLOU/febba588-ff5b-4277-b600-c4c76252c317-MotleyFool-TMOT-1c387926-06ba00e6.jpg?crop=1445,1429,x313,y0"
            alt="about_us"
            width={100}
            height={100}
            priority
            className="w-full h-[300px] md:h-full object-cover rounded-xl"
          />
        </div>
        <div className="bg-white flex flex-col justify-center border rounded-xl p-2 shadow-md text-black">
          <p className="py-2 text-center font-bold text-4xl mb-6">
            CONTACT FORM
          </p>
          <form action="/submit" method="POST" className="p-6 rounded">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-base"
                placeholder="Eg: Your Full Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="abc@gmail.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="+1 012 345 6789"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                className="w-full p-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 px-4 rounded-lg pt-2 text-xl h-12"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
