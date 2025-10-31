"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { createPrivateSupabaseClient } from "@/lib/supabasePrivate";
import { ArrowLeft, Star } from "lucide-react";
import StarsBackground from "@/components/StarsBackground";
import SiteLogo from "@/components/siteLogo/SiteLogo";
import Link from "next/link";
import { createPublicSupabaseClient } from "@/lib/supabasePublic";

// StarRating component remains the same
const StarRating = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-300">Your Rating</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                        <Star
                            key={star}
                            className={`w-8 h-8 cursor-pointer ${isFilled ? "text-yellow-400" : "text-gray-600"
                                }`}
                            fill={isFilled ? "currentColor" : "none"}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default function ClientSay() {
    const { getToken } = useAuth();
    const [rating, setRating] = useState(5);
    const [supabase, setSupabase] = useState(null);

    // Initialize Supabase client with JWT token
    useEffect(() => {
        async function initSupabase() {
            const token = await getToken({ template: "supabase" });
            const client = createPublicSupabaseClient(token);
            setSupabase(client);
        }
        initSupabase();
    }, [getToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return;

        const name = e.target.name.value.trim();
        const company = e.target.company.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();

        if (!name || !message) {
            alert("Please fill in your name and a testimonial message!");
            return;
        }

        const { error } = await supabase
            .from("yms_success_stories")
            .insert([{ name, company, email, rating, message }]);

        if (error) {
            console.error("❌ Supabase Insert Error:", error);
            alert("Something went wrong. Please try again!");
        } else {
            alert("✅ Thank you for your testimonial! We truly appreciate it.");
            e.target.reset();
            setRating(5);
        }
    };

    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <StarsBackground />
            <header className="fixed w-full top-0 z-50 backdrop-blur-lg border-b border-gray-800/50 py-5">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-300 hover:text-violet-400 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                    <SiteLogo />
                </div>
            </header>

            <section className="relative z-10 flex items-center justify-center min-h-screen px-6 py-24">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                            Share Your Success Story.
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                                We'd Love to Hear It.
                            </span>
                        </h2>
                        <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                            Had a great experience working with us? Share your story and help
                            inspire others! Your testimonial means the world to us.
                        </p>
                    </div>

                    <div className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-violet-900/10">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                            <StarRating rating={rating} setRating={setRating} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    required
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                                />
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Company / Title (Optional)"
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email (Optional)"
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                            />
                            <textarea
                                name="message"
                                rows={6}
                                placeholder="What did you love about the experience? How did we help you succeed?"
                                required
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                            />
                            <button
                                type="submit"
                                className="mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-3 rounded-lg text-lg font-semibold text-white shadow-lg shadow-violet-800/30 transition-all transform hover:scale-105 cursor-pointer"
                            >
                                Submit Testimonial
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
