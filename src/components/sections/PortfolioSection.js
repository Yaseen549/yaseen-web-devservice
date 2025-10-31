"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Boxes, ArrowRight } from "lucide-react";
import AiCircuitIcon from "@/utils/AiCircuitIcon";

// --- Section Wrapper ---
const Section = ({ id, title, highlight, subheading, children }) => (
    <section
        id={id}
        className="max-w-7xl mx-auto px-6 py-12 z-10 min-h-screen flex flex-col justify-center"
    >
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
                {title} <span className="text-violet-400">{highlight}</span>
            </h2>
            {subheading && (
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                    {subheading}
                </p>
            )}
        </div>
        {children}
    </section>
);

// --- Motion Variants ---
const cardHover = {
    scale: 1.03,
    y: -4,
    transition: { type: "spring", stiffness: 300, damping: 20 },
};

// --- Project Data ---
const projects = [
    {
        title: "SnippKit (SaaS)",
        image: "https://snippkit.com/og-image.png",
        description:
            "A full-stack SaaS platform for developers to save, organize, and share code snippets.",
        tags: ["Next.js", "React", "Supabase", "Tailwind"],
        link: "https://snippkit.com",
    },
    {
        title: "AI Prompt Library",
        icon: Sparkles,
        iconColor: "text-blue-400",
        description:
            "A curated library of AI prompts for developers, designers, and content creators.",
        tags: ["AI", "React", "Search"],
        link: "https://snippkit.com/prompts",
    },
    {
        title: "Developer Tools",
        icon: Boxes,
        iconColor: "text-orange-400",
        description:
            "A collection of free utilities like JSON formatters, color pickers, and more.",
        tags: ["JavaScript", "Utilities", "CSS"],
        link: "https://snippkit.com/tools",
    },
    {
        title: "Sidr AI",
        icon: AiCircuitIcon,
        iconColor: "text-violet-400",
        description:
            "An AI-powered assistant integrated directly into the SnippKit code editor.",
        tags: ["AI", "LLM", "Editor Plugin"],
        link: "https://snippkit.com/snippkit-ai",
    },
];

// --- Project Card ---
const ProjectCard = ({ project }) => {
    const { title, description, tags, link, image, icon: Icon, iconColor } = project;

    return (
        <Link
            href={link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
        >
            <motion.div
                whileHover={cardHover}
                className="group bg-gray-950/60 border border-gray-800 rounded-xl shadow-lg hover:border-violet-500/50 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
                {/* Image / Icon */}
                <div className="h-36 flex items-center justify-center bg-black">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : Icon ? (
                        <Icon className={`w-16 h-16 ${iconColor || "text-violet-400"}`} />
                    ) : null}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-sm flex-grow">{description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs bg-gray-800 text-violet-300 px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-4 text-sm font-semibold text-violet-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                        View Project <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

// --- Portfolio Section ---
export default function PortfolioSection() {
    return (
        <Section
            id="portfolio"
            title="Our Recent"
            highlight="Work"
            subheading="We take pride in our work. Here are some of the projects we've recently designed and launched."
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-stretch">
                {projects.map((p) => (
                    <ProjectCard key={p.title} project={p} />
                ))}
            </div>
        </Section>
    );
}
