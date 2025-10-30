// app/components/sections/ServicesSection.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Layers, Brush, ShoppingCart, Rocket, Wrench } from "lucide-react";

// Section Wrapper (can be moved to its own component later if needed)
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
const services = [
    { icon: Globe, title: "Website Development", desc: "Modern responsive sites that impress." },
    { icon: Layers, title: "Web Apps / SaaS", desc: "Full-stack apps built to scale." },
    { icon: Brush, title: "UI/UX Design", desc: "Beautiful, intuitive interfaces." },
    { icon: ShoppingCart, title: "E-Commerce", desc: "Custom stores built for conversions." },
    { icon: Rocket, title: "SEO & Performance", desc: "Fast, discoverable experiences." },
    { icon: Wrench, title: "Maintenance & Support", desc: "Ongoing updates & improvements." },
];

export default function ServicesSection() {
    return (
        <Section id="services" title="Our" highlight="Services">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(({ icon: Icon, title, desc }) => (
                    <motion.div
                        key={title}
                        whileHover={cardHover}
                        className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 hover:border-violet-500/50 rounded-xl p-8 text-center shadow-lg group transition-colors cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-gray-800 text-violet-400 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:bg-violet-900/50 transition-all">
                            <Icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
                        <p className="text-gray-400">{desc}</p>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}