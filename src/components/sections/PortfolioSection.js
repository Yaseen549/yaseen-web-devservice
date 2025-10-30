// app/components/sections/PortfolioSection.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Boxes, ArrowRight, PlusCircle } from "lucide-react";
import AiCircuitIcon from "@/utils/AiCircuitIcon";

// --- Section Wrapper (No Change) ---
const Section = ({ id, title, highlight, subheading, children }) => (
    <section id={id} className="max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {title} <span className="text-violet-400">{highlight}</span>
            </h2>
            {subheading && (
                <p className="text-lg text-gray-400">
                    {subheading}
                </p>
            )}
        </div>
        {children}
    </section>
);

// --- Motion Variants (No Change) ---
const cardHover = {
    scale: 1.03,
    y: -6,
    transition: { type: "spring", stiffness: 300, damping: 20 },
};

// --- Enriched Project Data (No Change) ---
const projects = [
    {
        title: "SnippKit (SaaS)",
        image: "https://snippkit.com/og-image.png",
        description: "A full-stack SaaS platform for developers to save, organize, and share code snippets.",
        tags: ["Next.js", "React", "Supabase", "Tailwind"],
        link: "https://snippkit.com",
    },
    {
        title: "AI Prompt Library",
        icon: Sparkles,
        iconColor: "text-blue-400",
        description: "A curated library of AI prompts for developers, designers, and content creators.",
        tags: ["AI", "React", "Search"],
        link: "https://snippkit.com/prompts",
    },
    {
        title: "Developer Tools",
        icon: Boxes,
        iconColor: "text-orange-400",
        description: "A collection of free utilities like JSON formatters, color pickers, and more.",
        tags: ["JavaScript", "Utilities", "CSS"],
        link: "https://snippkit.com/tools",
    },
    {
        title: "Sidr AI",
        icon: AiCircuitIcon,
        iconColor: "text-violet-400",
        description: "An AI-powered assistant integrated directly into the SnippKit code editor.",
        tags: ["AI", "LLM", "Editor Plugin"],
        link: "https://snippkit.com/snippkit-ai",
    },
];


// --- ProjectCard Component (MODIFIED) ---
const ProjectCard = ({ project }) => {
    const { title, description, tags, link, image, icon: Icon, iconColor, isPlaceholder } = project;

    // Conditional styles for placeholder card
    const cardClasses = isPlaceholder
        ? "bg-gray-950/30 border-dashed border-gray-700 hover:border-violet-500/50 hover:bg-gray-900/40 cursor-pointer"
        : "bg-gray-950/60 border border-gray-800 hover:border-violet-500/50";

    const hoverEffect = isPlaceholder ? {} : cardHover;

    // Conditional styles for content alignment
    const contentClasses = isPlaceholder
        ? "items-center text-center"
        : "items-start text-left";

    const tagJustify = isPlaceholder ? "justify-center" : "justify-start";

    return (
        <Link
            href={link || "#"} // Link to '#' if it's a placeholder
            target={link ? "_blank" : "_self"}
            rel={link ? "noopener noreferrer" : ""}
            className="block h-full"
        >
            <motion.div
                whileHover={hoverEffect}
                className={`group backdrop-blur-sm rounded-xl shadow-2xl shadow-black/20 
                   transition-all duration-300 overflow-hidden h-full flex flex-col 
                   ${cardClasses}`}
            >
                {/* Card Header: Reduced height */}
                <div className="w-full h-40 overflow-hidden flex items-center justify-center bg-black relative">
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            // --- CHANGED: object-contain to prevent cropping ---
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : Icon ? (
                        <Icon className={`w-20 h-20 ${iconColor || 'text-violet-400'}`} />
                    ) : (
                        <img
                            src="https://placehold.co/400x200/171717/a78bfa?text=Project"
                            alt="Placeholder"
                            className="w-full h-full object-cover" // Keep cover for placeholder
                        />
                    )}
                </div>

                {/* Card Content: Now with conditional alignment */}
                <div className={`p-6 flex-grow flex flex-col ${contentClasses}`}>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 flex-grow">
                        {description}
                    </p>

                    {tags && tags.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mb-6 ${tagJustify}`}>
                            {tags.map((tag) => (
                                <span key={tag} className="text-xs bg-gray-800 text-violet-300 px-2.5 py-1 rounded-full font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer with "View Project" CTA */}
                    {!isPlaceholder && (
                        // mt-auto pushes this to the bottom of the flex-col
                        <div className="mt-auto text-sm font-semibold text-violet-400
                            flex items-center gap-2
                            transition-transform duration-300 group-hover:translate-x-1">
                            View Project
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
};


// --- Main Portfolio Section Component (MODIFIED) ---
export default function PortfolioSection() {
    const numProjects = projects.length;
    let gridColsClass = "";

    if (numProjects === 1) {
        gridColsClass = "grid-cols-1 max-w-sm mx-auto";
    } else if (numProjects === 2) {
        gridColsClass = "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto";
    } else if (numProjects === 3) {
        gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else if (numProjects === 4) {
        // --- CHANGED: max-w-4xl to max-w-3xl to shrink cards ---
        gridColsClass = "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto";
    } else {
        gridColsClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }

    return (
        <Section
            id="portfolio"
            title="Our Recent"
            highlight="Work"
            subheading="We take pride in our work. Here are some of the projects we've recently designed and launched."
        >
            <div className={`grid gap-8 ${gridColsClass}`}>

                {projects.map((p) => (
                    <ProjectCard key={p.title} project={p} />
                ))}

                {/* Dynamic "More Projects" Placeholder Card */}
                {/* {numProjects < 6 && (
                    <ProjectCard
                        key="more-projects-placeholder"
                        project={{
                            title: "More Projects Coming Soon!",
                            icon: PlusCircle,
                            iconColor: "text-gray-500",
                            description: "We're constantly working on exciting new things. Check back often for updates!",
                            tags: [],
                            isPlaceholder: true,
                        }}
                    />
                )} */}

                {numProjects === 0 && (
                    <p className="text-gray-400 text-center col-span-full">
                        No projects to display yet. Please check back soon!
                    </p>
                )}
            </div>
        </Section>
    );
}