"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquareDashed, Star } from "lucide-react";
// import TooltipButton from "@/components/Footer/TooltipButton"; // adjust the path

// Section Wrapper
const Section = ({ id, title, highlight, children }) => (
    <section id={id} className="max-w-7xl mx-auto px-6 py-24 z-10">
        <h2 className="text-4xl font-bold text-center mb-16">
            {title} <span className="text-violet-400">{highlight}</span>
        </h2>
        {children}
    </section>
);

// Motion Variants
const cardHover = {
    scale: 1.03,
    y: -5,
    transition: { type: "spring", stiffness: 300 },
};

// Data specific to this section
const testimonials = []; // Empty to show the empty state

export default function TestimonialsSection() {

    return (
        <Section id="testimonials" title="What Our" highlight="Clients Say">
            <div className="flex flex-col items-center gap-6">
                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={cardHover}
                                className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 hover:border-violet-500/50 rounded-xl p-8 shadow-lg flex flex-col cursor-pointer max-w-sm"
                            >
                                <p className="text-gray-300 italic mb-6 text-lg flex-grow">
                                    "{t.quote}"
                                </p>
                                <div className="mt-auto flex items-center gap-4 pt-4 border-t border-gray-700/50">
                                    <img
                                        src={t.img}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full border-2 border-violet-400 object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-white">{t.name}</h4>
                                        <p className="text-sm text-violet-300">{t.title}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-8 bg-gray-950/60 border-2 border-dashed border-gray-800 rounded-xl text-center max-w-lg gap-4">
                        <MessageSquareDashed className="w-12 h-12 text-gray-600" />
                        <h3 className="text-xl font-semibold text-white">
                            Testimonials Coming Soon
                        </h3>
                        <p className="text-gray-400">
                            We're currently gathering feedback from our amazing clients. Check
                            back soon to see what they have to say!
                        </p>

                        <a
                            href="/client-say"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-violet-100 text-violet-700 bg-violet-200 transition-all duration-300"
                        >
                            <Star size={16} />
                            Send Testimonial
                        </a>
                    </div>
                )}
            </div>
        </Section>
    );
}
