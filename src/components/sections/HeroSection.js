"use client";

import React from "react";
import { ArrowRight, Sparkles, Mouse } from "lucide-react";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative flex flex-col justify-center items-center min-h-[90vh] text-center px-6 z-10"
        >
            {/* Pre-headline pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span>Pixel-Perfect Web Craft</span>
            </div>

            {/* Updated Headline */}
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                Building Web Experiences
            </h2>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mt-1 md:mt-3">
                That Inspire
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
                We craft high-performing websites, SaaS, and digital
                experiences that convert and captivate.
            </p>

            {/* Updated Buttons with refined hover effects */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                    href="#contact"
                    className="inline-flex bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8 py-3 rounded-lg text-lg font-semibold items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-700/50 shadow-lg shadow-violet-800/30 cursor-pointer"
                >
                    Get a Quote <ArrowRight className="w-4 h-4" />
                </a>
                <a
                    href="#portfolio"
                    className="bg-gray-800/50 border border-gray-700 hover:bg-gray-800/80 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:border-violet-400 hover:text-violet-300 cursor-pointer"
                >
                    View Work
                </a>
            </div>

            {/* Updated Scroll Indicator */}
            <div className="absolute bottom-10 flex items-center gap-2 text-gray-500 animate-pulse">
                <Mouse className="w-5 h-5" />
                <span className="text-sm font-medium">Scroll</span>
            </div>
        </section>
    );
}
