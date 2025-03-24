"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackProps {
    data: TopRatedMovie[];
}

const Feedback = ({ data }: FeedbackProps) => {
    const [rating, setRating] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [vote, setVote] = useState<string>("");

    const movieTitle = data?.[0]?.title || "this movie";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Rating:", rating);
        console.log("Feedback:", feedback);
        console.log("Voted Movie:", vote);
    };

    return (
        <div className="rounded-lg container mx-auto flex flex-col md:flex-row justify-between gap-8">
            <div className="rounded-lg w-full">
                <h2 className="text-white text-lg font-semibold mb-4">
                    How do you rate the {movieTitle} movie?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                    <RadioGroup value={rating} onValueChange={setRating} className="text-white flex">
                        {["Bad", "Good", "Average", "Excellent"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={option} className="border-white" />
                                <Label htmlFor={option} className="text-white">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <Textarea
                        className="bg-gray-700 text-white min-h-32 resize-none"
                        placeholder="Your feedback helps others decide which films to watch..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />

                    <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white self-end w-max">
                        Submit
                    </Button>
                </form>
            </div>

            <div className="rounded-lg w-full">
                <h2 className="text-white text-lg font-semibold mb-4">Vote For Movie</h2>

                <RadioGroup value={vote} onValueChange={setVote} className="text-white space-y-2">
                    {data?.slice(0, 5).map((movie) => (
                        <div
                            key={movie.title}
                            className="flex justify-between items-center p-3 rounded-md cursor-pointer hover:bg-gray-600 transition"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={movie.title} id={movie.title} className="border-white" />
                                <Label htmlFor={movie.title} className="text-white">
                                    {movie.title}
                                </Label>
                            </div>

                            <div className="px-2 py-[1px] flex justify-center items-center bg-gray-400 text-white text-sm rounded-xl">
                                {movie.vote_count}
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
};

export default Feedback;
