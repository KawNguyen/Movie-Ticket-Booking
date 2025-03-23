"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
interface FeedbackProps {
    data: TopRatedMovie[];
}

const Feedback = ({ data }: FeedbackProps) => {
    const [rating, setRating] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");

    const movieTitle = data?.[0]?.title || "this movie";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Rating:", rating);
        console.log("Feedback:", feedback);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg container max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Feedback Form */}
            <div className=" rounded-lg w-full">
                <h2 className="text-white text-lg font-semibold mb-4">
                    How do you rate the ${movieTitle} movie?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating Selection */}
                    <div className="flex space-x-4 text-white">
                        {["Bad", "Good", "Average", "Excellent"].map((option) => (
                            <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={option}
                                    checked={rating === option}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="hidden"
                                />
                                <div
                                    className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${rating === option ? "bg-purple-500" : "bg-transparent"
                                        }`}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>

                    {/* Feedback Textarea */}
                    <textarea
                        className="w-full bg-gray-700 text-white p-2 rounded-md h-24"
                        placeholder="Your feedback helps others decide which films to watch..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    {/* Submit Button */}
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white justify-start w-max">
                        Submit
                    </Button>
                </form>
            </div>

            {/* Vote for Movie Section */}
            <div className="bg-gray-800 p-6 rounded-lg w-full">
                <h2 className="text-white text-lg font-semibold mb-4">Vote For Movie</h2>


                <div className="space-y-3">
                    {data?.slice(0, 5).map((movie: { title: string, vote_count: number }) => (
                        <div
                            key={movie.title}
                            className="flex justify-between items-center bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600 transition"
                        >
                            <span>
                                {movie.title}
                            </span>
                            <p>
                                {movie.vote_count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
