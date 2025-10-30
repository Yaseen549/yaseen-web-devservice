// app/components/StarsBackground.js
"use client";

import React, { useEffect, useRef } from "react";

// The hook logic is now self-contained inside this component's file
const useStarsCanvas = (ref) => {
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let stars = [];
        let animationId;
        const numStars = 500;
        const mouse = { x: undefined, y: undefined };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

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
                this.o = this.oo + Math.sin(Date.now() * 0.001 * Math.random()) * 0.1;
                if (mouse.x !== undefined && mouse.y !== undefined) {
                    const dx = this.x - mouse.x,
                        dy = this.y - mouse.y,
                        dist = Math.sqrt(dx * dx + dy * dy),
                        force = (150 - dist) / 150;
                    if (dist < 150) {
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                        this.r = this.or + force * 1.5;
                        this.o = this.oo + force * 0.5;
                    } else this.reset();
                } else {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
                this.draw();
            }
            reset() {
                this.x += (this.ox - this.x) * 0.02;
                this.y += (this.oy - this.y) * 0.02;
                this.r = this.or;
            }
        }

        const init = () => {
            resize();
            stars = Array.from({ length: numStars }, () => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                return new Star(x, y, Math.random() * 1.2, Math.random() * 0.5 + 0.2);
            });
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((s) => s.update());
        };

        const mouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const mouseOut = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        };

        init();
        animate();
        window.addEventListener("resize", init);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseout", mouseOut);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", init);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseout", mouseOut);
        };
    }, [ref]);
};


export default function StarsBackground() {
    const canvasRef = useRef(null);
    useStarsCanvas(canvasRef);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}