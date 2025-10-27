// components/snippets/DiscoverBanner.js
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
// motion and AnimatePresence are no longer needed if SpeakingBubble is gone
// import { motion, AnimatePresence } from "framer-motion"; 

// ----------------------------------------------------------------------
// SNIPPET_THOUGHTS array (REMOVED)
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// SpeakingBubble Component (REMOVED)
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Helper Component: SnippetNetworkBackground (MODIFIED)
// - onShowThought prop and all related logic removed
// ----------------------------------------------------------------------
const SnippetNetworkBackground = ({ containerRef }) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    // const thoughtTimer = useRef(null); // REMOVED

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current; // The banner div
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let mouse = { x: null, y: null };

        const PARTICLE_COUNT = 60;
        const MAX_LINK_DISTANCE = 140;
        const MOUSE_LINK_DISTANCE = 180;
        const PARTICLE_SPEED = 0.3;
        const PARTICLE_COLOR = "rgba(156, 163, 175, 0.4)";
        const PARTICLE_LINE_COLOR = "168, 85, 247";
        const MOUSE_LINE_COLOR = "6, 182, 212";

        class Particle {
            constructor(canvasWidth, canvasHeight, id) {
                this.id = id;
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
                this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
                this.radius = 1.5;
            }
            update(canvasWidth, canvasHeight) {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
                if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = PARTICLE_COLOR;
                ctx.fill();
            }
        }

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles.current = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.current.push(new Particle(canvas.width, canvas.height, i));
            }
        };

        const drawLines = () => {
            const currentWidth = canvas.width;
            const currentHeight = canvas.height;

            for (let i = 0; i < particles.current.length; i++) {
                for (let j = i + 1; j < particles.current.length; j++) {
                    const dist = Math.hypot(particles.current[i].x - particles.current[j].x, particles.current[i].y - particles.current[j].y);
                    if (dist < MAX_LINK_DISTANCE) {
                        const opacity = 1 - (dist / MAX_LINK_DISTANCE);
                        ctx.strokeStyle = `rgba(${PARTICLE_LINE_COLOR}, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles.current[i].x, particles.current[i].y);
                        ctx.lineTo(particles.current[j].x, particles.current[j].y);
                        ctx.stroke();
                    }
                }
                if (mouse.x !== null && mouse.y !== null) {
                    const mouseDist = Math.hypot(particles.current[i].x - mouse.x, particles.current[i].y - mouse.y);
                    if (mouseDist < MOUSE_LINK_DISTANCE && mouse.x >= 0 && mouse.x <= currentWidth && mouse.y >= 0 && mouse.y <= currentHeight) {
                        const opacity = 1 - (mouseDist / MOUSE_LINK_DISTANCE);
                        ctx.strokeStyle = `rgba(${MOUSE_LINE_COLOR}, ${opacity * 0.5})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(particles.current[i].x, particles.current[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            const currentWidth = canvas.width;
            const currentHeight = canvas.height;
            ctx.clearRect(0, 0, currentWidth, currentHeight);
            particles.current.forEach(p => {
                p.update(currentWidth, currentHeight);
                p.draw();
            });
            drawLines();
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('resize', resizeCanvas);

        const resizeTimeout = setTimeout(resizeCanvas, 0);
        animate();

        // --- All thought/bubble logic REMOVED ---

        return () => {
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationFrameId);
            // clearTimeout(thoughtTimer.current); // REMOVED
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [containerRef]); // onShowThought dependency removed

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />;
};

// ----------------------------------------------------------------------
// Main Component: DiscoverBanner (MODIFIED)
// - All bubble state and handlers removed
// ----------------------------------------------------------------------
export default function DiscoverBanner() {
    const bannerRef = useRef(null);
    // const [activeThought, setActiveThought] = useState(null); // REMOVED
    // const thoughtClearTimer = useRef(null); // REMOVED

    // const handleShowThought = useCallback((particle) => { ... }, []); // REMOVED

    return (
        <div
            ref={bannerRef}
            className="relative overflow-hidden bg-white dark:bg-zinc-950 rounded-3xl p-12 lg:p-24 shadow-2xl shadow-zinc-200/50 dark:shadow-black/20 border border-zinc-200 dark:border-zinc-800"
        >
            {/* --- Layer 1: Living Canvas Background --- */}
            <SnippetNetworkBackground
                containerRef={bannerRef}
            // onShowThought={handleShowThought} // REMOVED
            />

            {/* --- Layer 0: Background Grids --- */}
            <div
                className="absolute inset-0 z-0 opacity-10 hidden dark:block"
                style={{
                    backgroundImage: `radial-gradient(#27272a 1px, transparent 1px)`,
                    backgroundSize: `20px 20px`,
                }}
            />
            <div
                className="absolute inset-0 z-0 opacity-20 dark:hidden"
                style={{
                    backgroundImage: `radial-gradient(#e4e4e7 1px, transparent 1px)`,
                    backgroundSize: `20px 20px`,
                }}
            />

            {/* --- Layer 0: Animated Gradient Blobs --- */}
            <div className="absolute top-1/4 left-1/2 h-80 w-80 md:h-[500px] md:w-[500px] bg-gradient-to-br from-cyan-500/10 dark:from-cyan-500/20 to-transparent rounded-full blur-[150px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 md:h-[400px] md:w-[400px] bg-gradient-to-tl from-purple-500/10 dark:from-purple-500/15 to-transparent rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 translate-y-1/3" />

            {/* --- Layer 2: Speaking Bubble (REMOVED) --- */}
            {/*
            <AnimatePresence>
                {activeThought && ( ... )}
            </AnimatePresence>
            */}

            {/* --- Layer 2: Header Content --- */}
            <header className="relative z-10 text-center max-w-4xl mx-auto space-y-5">
                <h1 className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                    Innovate. Build. Share.
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Connect with a global community of developers. Find and share
                    high-quality, open-source code snippets and scripts to accelerate
                    your projects.
                </p>
            </header>
        </div>
    );
}