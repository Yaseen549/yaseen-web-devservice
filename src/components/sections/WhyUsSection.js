"use client";

import React from "react";
import { LayoutDashboard, BrainCircuit, Zap } from "lucide-react";

// Section Wrapper
const Section = ({ id, title, highlight, children }) => (
    <section id={id} className="max-w-7xl mx-auto px-6 py-24 z-10">
        <h2 className="text-4xl font-bold text-center mb-16">
            {title} <span className="text-violet-400">{highlight}</span>
        </h2>
        {children}
    </section>
);

// Reusable Feature Card
const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <div className="mb-4">
            <Icon className="w-10 h-10 text-violet-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

// The data for the features
const features = [
    {
        icon: LayoutDashboard,
        title: "Live Project Tracking",
        description: "No more guessing games. We provide a dedicated client dashboard to track your project's status in real-time, from 'planning' to 'deployed'."
    },
    {
        icon: BrainCircuit,
        title: "AI-Augmented Craftsmanship",
        description: "We blend AI-driven efficiency for rapid prototyping with meticulous, 'handmade' code. You get a high-performance, custom-built site, not a generic template."
    },
    {
        icon: Zap,
        title: "Performance & Security",
        description: "Our sites are built on modern, scalable architecture. We prioritize fast load times, rock-solid security, and a seamless user experience from the ground up."
    }
];

export default function WhyUsSection() {
    return (
        <Section id="why-us" title="What Makes Us" highlight="Different">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <FeatureCard
                        key={i}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </Section>
    );
}
