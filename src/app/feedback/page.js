"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, Lightbulb, MessageCircle } from "lucide-react";
import StarsBackground from "@/components/StarsBackground";
import SiteLogo from "@/components/siteLogo/SiteLogo";
import { createPublicSupabaseClient } from "@/lib/supabasePublic";

// ====== Feedback Type Card Component ======
const FeedbackTypeCard = ({ icon: Icon, label, onClick, isActive }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all cursor-pointer ${isActive
                ? "bg-violet-900/50 border-violet-500"
                : "bg-gray-800/40 border-gray-700 hover:border-gray-500"
            }`}
    >
        <Icon className={`w-8 h-8 mb-2 ${isActive ? "text-violet-300" : "text-gray-400"}`} />
        <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-300"}`}>
            {label}
        </span>
    </button>
);

// ====== Feedback Page Component ======
export default function Feedback() {
    const [feedbackType, setFeedbackType] = useState("Feature Request");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const placeholders = {
        "Bug Report":
            "Describe the bug in detail. What did you expect to happen? What actually happened?",
        "Feature Request": "Describe your brilliant idea. What problem would it solve?",
        "General Feedback": "What's on your mind? We're listening.",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const supabase = createPublicSupabaseClient();

        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();

        if (!message) {
            alert("Please enter your feedback!");
            return;
        }

        setIsSubmitting(true);

        const { error } = await supabase.from("yms_feedback").insert([
            {
                email: email || null,
                feedback_type: feedbackType,
                message,
            },
        ]);

        setIsSubmitting(false);

        if (error) {
            console.error("Error submitting feedback:", error.message);
            alert("❌ Something went wrong. Please try again.");
            return;
        }

        alert("✅ Thank you for your feedback! We've received it.");
        e.target.reset();
        setFeedbackType("Feature Request");
    };

    return (
        <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
            <StarsBackground />

            {/* ===== Header ===== */}
            <header className="fixed w-full top-0 z-50 backdrop-blur-lg border-b border-gray-800/50 py-5">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-300 hover:text-violet-400 transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <SiteLogo />
                </div>
            </header>

            {/* ===== Feedback Form Section ===== */}
            <section className="relative z-10 flex items-center justify-center min-h-screen px-6 py-24">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* --- Left Column: Text --- */}
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                            Help Us Shape
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                                {" "}
                                What's Next.
                            </span>
                        </h2>
                        <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
                            Your insights are invaluable. Spotted a bug? Have a brilliant feature idea?
                            We're all ears.
                        </p>
                    </div>

                    {/* --- Right Column: The Form --- */}
                    <div className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-violet-900/10">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                            <div className="grid grid-cols-3 gap-4">
                                <FeedbackTypeCard
                                    icon={Bug}
                                    label="Bug Report"
                                    onClick={() => setFeedbackType("Bug Report")}
                                    isActive={feedbackType === "Bug Report"}
                                />
                                <FeedbackTypeCard
                                    icon={Lightbulb}
                                    label="Feature Request"
                                    onClick={() => setFeedbackType("Feature Request")}
                                    isActive={feedbackType === "Feature Request"}
                                />
                                <FeedbackTypeCard
                                    icon={MessageCircle}
                                    label="General"
                                    onClick={() => setFeedbackType("General Feedback")}
                                    isActive={feedbackType === "General Feedback"}
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
                                rows={8}
                                placeholder={placeholders[feedbackType]}
                                required
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none transition"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`mt-2 px-6 py-3 rounded-lg text-lg font-semibold text-white shadow-lg shadow-violet-800/30 transition-all transform hover:scale-105 cursor-pointer ${isSubmitting
                                        ? "bg-gray-700 cursor-not-allowed"
                                        : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
