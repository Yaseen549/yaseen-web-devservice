// app/components/sections/TestimonialsSection.js
"use client";

import React from "react";
import { motion } from "framer-motion";

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
const testimonials = [
    {
        quote:
            "Working with MockStudio was a game-changer. They delivered a high-quality product faster than we thought possible.",
        name: "Alice Johnson",
        title: "CEO, TechNova",
        img: "https://placehold.co/100x100/a78bfa/171717?text=AJ",
    },
    {
        quote:
            "The team's attention to detail and creative solutions were outstanding. Highly recommended.",
        name: "David Lee",
        title: "Founder, Creative Labs",
        img: "https://placehold.co/100x100/818cf8/171717?text=DL",
    },
    // Try removing this one — layout still stays centered
    {
        quote:
            "Our new website has seen a 200% increase in conversions. Seamless and professional from start to finish.",
        name: "Maria Garcia",
        title: "Marketing Director, ScaleUp",
        img: "https://placehold.co/100x100/f472b6/171717?text=MG",
    },
];

export default function TestimonialsSection() {
    return (
        <Section id="testimonials" title="What Our" highlight="Clients Say">
            {/* ✅ This wrapper centers the grid regardless of item count */}
            <div className="flex justify-center">
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
            </div>
        </Section>
    );
}
