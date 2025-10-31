"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Settings, ChevronsRight, Rocket, Sparkles, Wind, EyeOff } from "lucide-react";

// This custom hook contains all the canvas logic.
// It now accepts a 'settings' object to control animations.
const useStarsCanvas = (ref, settings) => {
    // Create a ref to hold the latest settings.
    // This allows us to update settings without re-triggering the main useEffect.
    const settingsRef = useRef(settings);

    // This effect runs *only* when the settings prop changes.
    // It updates the ref, but does NOT re-run the canvas setup.
    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    // This is the main canvas setup effect.
    // It now *only* depends on the 'ref' and runs ONCE.
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let stars = [];
        let spaceship;
        let animationId;
        const numStars = 500;
        const mouse = { x: undefined, y: undefined };

        // Utility function to resize the canvas to fill the window
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // ====== Star Class ======
        class Star {
            constructor(x, y, r, o) {
                Object.assign(this, {
                    x, y, ox: x, oy: y, r, or: r, o, oo: o,
                    vx: (Math.random() - 0.5) * 0.1,
                    vy: (Math.random() - 0.5) * 0.1,
                });
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${this.o})`;
                ctx.fill();
            }
            update() {
                // Read from the settingsRef to get the *current* setting
                if (settingsRef.current.starTwinkle) {
                    this.o = this.oo + Math.sin(Date.now() * 0.001 * Math.random()) * 0.1;
                } else {
                    this.o = this.oo;
                }

                // Read from settingsRef and use the local mouse object
                if (settingsRef.current.starRipple && mouse.x !== undefined && mouse.y !== undefined) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = (150 - dist) / 150;

                    if (dist < 150) {
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                        this.r = this.or + force * 1.5;
                        this.o = this.oo + force * 0.5;
                    } else {
                        this.reset();
                    }
                } else {
                    // Default drift
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                    // Reset star position if ripple is on
                    if (settingsRef.current.starRipple) this.reset();
                }
                this.draw();
            }
            reset() {
                this.x += (this.ox - this.x) * 0.02;
                this.y += (this.oy - this.y) * 0.02;
                this.r = this.or;
            }
        }

        // ====== Spaceship Class ======
        class Spaceship {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = 8;
                this.angle = 0;
                this.maxSpeed = 3;
                this.attractionRadius = 300;
                this.acceleration = 0.2;
                this.turnForce = 0.05;
                this.turnBuffer = 100;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                const bodyHeight = this.size * 2.2;
                const bodyWidth = this.size * 1.1;

                ctx.fillStyle = "#ff8a65";

                ctx.beginPath();
                ctx.moveTo(-bodyWidth / 2, bodyHeight * 0.2);
                ctx.lineTo(-bodyWidth * 0.9, bodyHeight * 0.6);
                ctx.lineTo(-bodyWidth / 2, bodyHeight * 0.4);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(bodyWidth / 2, bodyHeight * 0.2);
                ctx.lineTo(bodyWidth * 0.9, bodyHeight * 0.6);
                ctx.lineTo(bodyWidth / 2, bodyHeight * 0.4);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(-bodyWidth / 2, -bodyHeight / 2);
                ctx.lineTo(bodyWidth / 2, -bodyHeight / 2);
                ctx.quadraticCurveTo(bodyWidth * 0.8, 0, bodyWidth / 2, bodyHeight / 2);
                ctx.lineTo(-bodyWidth / 2, bodyHeight / 2);
                ctx.quadraticCurveTo(-bodyWidth * 0.8, 0, -bodyWidth / 2, -bodyHeight / 2);
                ctx.closePath();

                const bodyGradient = ctx.createLinearGradient(-bodyWidth / 2, 0, bodyWidth / 2, 0);
                bodyGradient.addColorStop(0, "#bcaaa4");
                bodyGradient.addColorStop(0.3, "#f5f5f5");
                bodyGradient.addColorStop(1, "#8d6e63");
                ctx.fillStyle = bodyGradient;
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(-bodyWidth / 2, -bodyHeight / 2);
                ctx.quadraticCurveTo(0, -bodyHeight * 0.8, bodyWidth / 2, -bodyHeight / 2);
                ctx.closePath();
                ctx.fillStyle = "#ff8a65";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(0, -bodyHeight * 0.1, this.size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = "#e0f7fa";
                ctx.strokeStyle = "#b0bec5";
                ctx.lineWidth = 1.5;
                ctx.fill();
                ctx.stroke();

                const flameLength = this.size * (Math.random() * 1.5 + 1.5);
                ctx.beginPath();
                ctx.moveTo(0, bodyHeight / 2);
                ctx.quadraticCurveTo(-this.size * 0.7, bodyHeight / 2 + flameLength * 0.5, 0, bodyHeight / 2 + flameLength);
                ctx.quadraticCurveTo(this.size * 0.7, bodyHeight / 2 + flameLength * 0.5, 0, bodyHeight / 2);
                ctx.closePath();

                const flameGradient = ctx.createRadialGradient(0, bodyHeight / 2, this.size * 0.15, 0, bodyHeight / 2, flameLength);
                flameGradient.addColorStop(0, "rgba(255, 224, 130, 1)");
                flameGradient.addColorStop(1, "rgba(251, 140, 0, 0.5)");
                ctx.fillStyle = flameGradient;
                ctx.fill();

                ctx.restore();
            }

            update() {
                // Use the local mouse object
                if (mouse.x !== undefined && mouse.y !== undefined) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > 0 && dist < this.attractionRadius) {
                        const force = (this.attractionRadius - dist) / this.attractionRadius;
                        this.vx += (dx / dist) * force * this.acceleration;
                        this.vy += (dy / dist) * force * this.acceleration;
                    }
                }

                const buffer = this.turnBuffer;

                if (this.x < buffer) {
                    this.vx += this.turnForce;
                } else if (this.x > canvas.width - buffer) {
                    this.vx -= this.turnForce;
                }

                if (this.y < buffer) {
                    this.vy += this.turnForce;
                } else if (this.y > canvas.height - buffer) {
                    this.vy -= this.turnForce;
                }

                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > this.maxSpeed) {
                    this.vx = (this.vx / speed) * this.maxSpeed;
                    this.vy = (this.vy / speed) * this.maxSpeed;
                }

                this.x += this.vx;
                this.y += this.vy;
                this.angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                this.draw();
            }
        }

        // Initialization function
        const init = () => {
            resize();

            // (Re)create stars and spaceship
            stars = Array.from({ length: numStars }, () => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                return new Star(x, y, Math.random() * 1.2, Math.random() * 0.5 + 0.2);
            });

            spaceship = new Spaceship(canvas.width / 2, canvas.height / 2);
        };

        // Animation loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Read from the settingsRef inside the animation loop
            if (settingsRef.current.showStars) {
                stars.forEach((s) => s.update());
            }

            if (settingsRef.current.showRocket && spaceship) {
                spaceship.update();
            }
        };

        // --- Event Listeners ---
        const mouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const mouseOut = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        };

        // --- Start Everything ---
        init();
        animate();

        // Add event listeners (init is the correct resize handler)
        window.addEventListener("resize", init);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseout", mouseOut);

        // Cleanup function for when the component unmounts
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", init);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseout", mouseOut);
        };
    }, [ref]); // Only run this effect once when the ref is available
};

// Helper component for the toggle switch UI (No Changes)
const ToggleSwitch = ({ label, icon: Icon, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-violet-900/50 rounded-lg transition-colors">
        <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-violet-300" />
            <span className="text-sm text-gray-200">{label}</span>
        </div>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
            <div className={`block w-8 h-4 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-gray-600'}`}></div>
            <div className={`dot absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
        </div>
    </label>
);

// The React component that renders the canvas AND the settings panel
export default function StarsBackgroundWithSettings() {
    const canvasRef = useRef(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState({
        showRocket: true,
        starRipple: true,
        starTwinkle: true,
        showStars: true,
    });

    // Apply the canvas logic to the ref, passing in the settings
    useStarsCanvas(canvasRef, settings);

    const handleSettingChange = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            {/* The Canvas element */}
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

            {/* Settings Open Button */}
            <motion.button
                className="fixed bottom-30 right-6 z-50 p-2 bg-gray-900/70 backdrop-blur-md text-white rounded-full shadow-lg border border-gray-700 hover:bg-violet-800 transition-colors"
                onClick={() => setIsSettingsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open animation settings"
                initial={{ x: 0 }}
                animate={{ x: isSettingsOpen ? "100%" : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <Settings className="w-4 h-4" />
            </motion.button>

            {/* Settings Panel */}
            <motion.div
                className="fixed bottom-2 right-0 z-60 w-72 bg-gray-950/80 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-l-2xl"
                initial={{ x: "100%" }}
                animate={{ x: isSettingsOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex justify-between items-center p-3 border-b border-gray-700">
                    <h3 className="text-base font-semibold text-white">Animation Settings</h3>
                    <button
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                        onClick={() => setIsSettingsOpen(false)}
                        aria-label="Close settings"
                    >
                        <ChevronsRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 space-y-1">
                    <ToggleSwitch
                        label="Show Rocket"
                        icon={Rocket}
                        checked={settings.showRocket}
                        onChange={() => handleSettingChange('showRocket')}
                    />
                    <ToggleSwitch
                        label="Star Twinkle"
                        icon={Sparkles}
                        checked={settings.starTwinkle}
                        onChange={() => handleSettingChange('starTwinkle')}
                    />
                    <ToggleSwitch
                        label="Mouse Ripple"
                        icon={Wind}
                        checked={settings.starRipple}
                        onChange={() => handleSettingChange('starRipple')}
                    />
                    <ToggleSwitch
                        label="Show Stars"
                        icon={EyeOff}
                        checked={settings.showStars}
                        onChange={() => handleSettingChange('showStars')}
                    />
                </div>
            </motion.div>
        </>
    );
}

