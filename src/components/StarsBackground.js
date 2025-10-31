"use client";

import React, { useEffect, useRef } from "react";

// This custom hook contains all the canvas logic.
const useStarsCanvas = (ref) => {
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

        // ====== Star Class (No Changes) ======
        class Star {
            constructor(x, y, r, o) {
                Object.assign(this, {
                    x,
                    y,
                    ox: x, // Original x
                    oy: y, // Original y
                    r,
                    or: r, // Original radius
                    o,
                    oo: o, // Original opacity
                    vx: (Math.random() - 0.5) * 0.1, // Slight velocity
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
                // Twinkle effect
                this.o = this.oo + Math.sin(Date.now() * 0.001 * Math.random()) * 0.1;

                // Mouse interaction
                if (mouse.x !== undefined && mouse.y !== undefined) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = (150 - dist) / 150; // Force proportional to distance

                    if (dist < 150) {
                        // Push away from mouse
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                        this.r = this.or + force * 1.5;
                        this.o = this.oo + force * 0.5;
                    } else {
                        // Return to original position if mouse is far
                        this.reset();
                    }
                } else {
                    // Default drift
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
                this.draw();
            }
            reset() {
                // Gently move back to original spot
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
                this.vx = (Math.random() - 0.5) * 2; // Initial random velocity
                this.vy = (Math.random() - 0.5) * 2;
                this.size = 8; // ***TINY ROCKET: Reduced base size from 12 to 8***
                this.angle = 0; 
                this.maxSpeed = 3;
                this.attractionRadius = 300;
                this.acceleration = 0.2;
                this.turnForce = 0.05; 
                this.turnBuffer = 100; 
            }

            // =======================================================
            // === REDESIGNED ROCKET DRAWING FUNCTION (SMALL & CUTE) ===
            // =======================================================
            draw() {
                ctx.save();
                // Move and rotate the canvas context to draw the ship
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                const bodyHeight = this.size * 2.2; // Slightly shorter
                const bodyWidth = this.size * 1.1; // Slightly slimmer

                // --- Fins (draw first to be behind body) ---
                ctx.fillStyle = "#ff8a65"; // Terracotta color for fins and nose
                
                // Left fin (Smaller and closer)
                ctx.beginPath(); 
                ctx.moveTo(-bodyWidth / 2, bodyHeight * 0.2);
                ctx.lineTo(-bodyWidth * 0.9, bodyHeight * 0.6);
                ctx.lineTo(-bodyWidth / 2, bodyHeight * 0.4);
                ctx.closePath();
                ctx.fill();

                // Right fin (Smaller and closer)
                ctx.beginPath(); 
                ctx.moveTo(bodyWidth / 2, bodyHeight * 0.2);
                ctx.lineTo(bodyWidth * 0.9, bodyHeight * 0.6);
                ctx.lineTo(bodyWidth / 2, bodyHeight * 0.4);
                ctx.closePath();
                ctx.fill();

                // --- Rocket Body (Cylinder/Pill shape - less bulgy) ---
                ctx.beginPath();
                ctx.moveTo(-bodyWidth / 2, -bodyHeight / 2);
                ctx.lineTo(bodyWidth / 2, -bodyHeight / 2);
                // ***Adjusted quadratic curve points for less bulge (closer to bodyWidth)***
                ctx.quadraticCurveTo(bodyWidth * 0.8, 0, bodyWidth / 2, bodyHeight / 2); 
                ctx.lineTo(-bodyWidth / 2, bodyHeight / 2);
                ctx.quadraticCurveTo(-bodyWidth * 0.8, 0, -bodyWidth / 2, -bodyHeight / 2); 
                ctx.closePath();

                // --- Body Gradient (to look rounded) ---
                const bodyGradient = ctx.createLinearGradient(-bodyWidth / 2, 0, bodyWidth / 2, 0);
                bodyGradient.addColorStop(0, "#bcaaa4"); // Darker clay (shadow)
                bodyGradient.addColorStop(0.3, "#f5f5f5"); // Light clay (highlight)
                bodyGradient.addColorStop(1, "#8d6e63"); // Darkest clay (shadow)
                ctx.fillStyle = bodyGradient;
                ctx.fill();

                // --- Nose Cone (Shorter and rounder for cuter look) ---
                ctx.beginPath();
                ctx.moveTo(-bodyWidth / 2, -bodyHeight / 2);
                // ***Shorter peak (-bodyHeight * 0.8) for a rounder nose***
                ctx.quadraticCurveTo(0, -bodyHeight * 0.8, bodyWidth / 2, -bodyHeight / 2); 
                ctx.closePath();
                ctx.fillStyle = "#ff8a65"; // Terracotta nose
                ctx.fill();

                // --- Cockpit Window (Smaller) ---
                ctx.beginPath();
                ctx.arc(0, -bodyHeight * 0.1, this.size * 0.3, 0, Math.PI * 2); // ***Reduced size to 0.3***
                ctx.fillStyle = "#e0f7fa"; // Light blue glass
                ctx.strokeStyle = "#b0bec5"; // Grey rim
                ctx.lineWidth = 1.5; // Thinner rim
                ctx.fill();
                ctx.stroke();

                // --- Softer "Clay" Flame (No significant change) ---
                const flameLength = this.size * (Math.random() * 1.5 + 1.5);
                ctx.beginPath();
                ctx.moveTo(0, bodyHeight / 2); // Base of flame
                ctx.quadraticCurveTo(-this.size * 0.7, bodyHeight / 2 + flameLength * 0.5, 0, bodyHeight / 2 + flameLength);
                ctx.quadraticCurveTo(this.size * 0.7, bodyHeight / 2 + flameLength * 0.5, 0, bodyHeight / 2);
                ctx.closePath();

                const flameGradient = ctx.createRadialGradient(0, bodyHeight / 2, this.size * 0.15, 0, bodyHeight / 2, flameLength);
                flameGradient.addColorStop(0, "rgba(255, 224, 130, 1)"); // Yellow center
                flameGradient.addColorStop(1, "rgba(251, 140, 0, 0.5)"); // Orange/transparent edge
                ctx.fillStyle = flameGradient;
                ctx.fill();

                ctx.restore(); // Restore context to default state
            }

            update() {
                // Accelerate towards mouse if it's close
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

                // Smooth U-Turn at viewport edge (No change from last update)
                const buffer = this.turnBuffer;
                
                // Horizontal check
                if (this.x < buffer) {
                    this.vx += this.turnForce; 
                } else if (this.x > canvas.width - buffer) {
                    this.vx -= this.turnForce; 
                }

                // Vertical check
                if (this.y < buffer) {
                    this.vy += this.turnForce; 
                } else if (this.y > canvas.height - buffer) {
                    this.vy -= this.turnForce; 
                }

                // Enforce max speed
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > this.maxSpeed) {
                    this.vx = (this.vx / speed) * this.maxSpeed;
                    this.vy = (this.vy / speed) * this.maxSpeed;
                }

                // Update position based on velocity
                this.x += this.vx;
                this.y += this.vy;

                // Update angle to point in the direction of velocity
                this.angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;

                this.draw();
            }
        }

        // Initialization function
        const init = () => {
            resize();
            stars = Array.from({ length: numStars }, () => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                return new Star(x, y, Math.random() * 1.2, Math.random() * 0.5 + 0.2);
            });

            // Initialize or center the smaller spaceship
            if (!spaceship) {
                spaceship = new Spaceship(canvas.width / 2, canvas.height / 2);
            } else {
                spaceship.x = canvas.width / 2;
                spaceship.y = canvas.height / 2;
            }
        };

        // Animation loop
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((s) => s.update());
            spaceship.update();
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

        // Add event listeners
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
    }, [ref]); 
};

// The React component that renders the canvas
export default function StarsBackground() {
    const canvasRef = useRef(null);
    useStarsCanvas(canvasRef); 

    // Render the canvas element
    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}