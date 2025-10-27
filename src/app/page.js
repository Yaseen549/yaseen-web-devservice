"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react"; // Added useRef
import {
  ArrowRight,
  Globe,
  Layers,
  Brush,
  ShoppingCart,
  Rocket,
  Wrench,
  Check,
  Twitter,
  Github,
  Linkedin,
  Database,
  BarChart2,
  LifeBuoy,
} from "lucide-react";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let stars = [];
    let numStars = 500;
    let mouse = {
      x: undefined,
      y: undefined,
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Star {
      constructor(x, y, radius, opacity) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.radius = radius;
        this.originalRadius = radius;
        this.opacity = opacity;
        this.originalOpacity = opacity;
        this.velocityX = (Math.random() - 0.5) * 0.1;
        this.velocityY = (Math.random() - 0.5) * 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        // Twinkle
        this.opacity = this.originalOpacity + Math.sin(Date.now() * 0.001 * Math.random()) * 0.1;

        // Mouse Ripple Effect
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          const maxDistance = 150;

          // Force is inversely proportional to distance
          const force = (maxDistance - dist) / maxDistance;

          if (dist < maxDistance) {
            // Apply force
            this.x += forceDirectionX * force * 2;
            this.y += forceDirectionY * force * 2;
            this.radius = this.originalRadius + force * 1.5;
            this.opacity = this.originalOpacity + force * 0.5;
          } else {
            // Return to original position and state
            this.x += (this.originalX - this.x) * 0.02;
            this.y += (this.originalY - this.y) * 0.02;
            this.radius = this.originalRadius;
          }
        } else {
          // Gentle drift
          this.x += this.velocityX;
          this.y += this.velocityY;
          if (this.x < 0 || this.x > canvas.width) this.velocityX = -this.velocityX;
          if (this.y < 0 || this.y > canvas.height) this.velocityY = -this.velocityY;
        }


        this.draw();
      }
    }

    const createStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.2;
        const opacity = Math.random() * 0.5 + 0.2;
        stars.push(new Star(x, y, radius, opacity));
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => star.update());
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    }

    const handleResize = () => {
      setCanvasSize();
      createStars();
    };

    setCanvasSize();
    createStars();
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeInOut",
      },
    }),
  };

  const cardHover = {
    scale: 1.03,
    y: -5,
    transition: { type: "spring", stiffness: 300 },
  };

  const services = [
    { icon: Globe, title: "Website Development", desc: "Modern responsive sites that impress." },
    { icon: Layers, title: "Web Apps / SaaS", desc: "Powerful full-stack applications built to scale." },
    { icon: Brush, title: "UI/UX Design", desc: "Beautiful, intuitive interfaces for every screen." },
    { icon: ShoppingCart, title: "E-Commerce", desc: "Custom online stores built for conversions." },
    { icon: Rocket, title: "SEO & Performance", desc: "Fast, discoverable, and optimized web experiences." },
    { icon: Wrench, title: "Maintenance & Support", desc: "Ongoing updates and improvements." },
  ];

  const projects = [
    {
      title: "SaaS Platform",
      desc: "A creative modern project built with Next.js, React, and Supabase.",
      img: "https://placehold.co/600x400/171717/a78bfa?text=SaaS+Platform",
      tags: ["Next.js", "React", "Supabase"],
    },
    {
      title: "E-Commerce Store",
      desc: "A high-conversion online store with a custom checkout flow.",
      img: "https://placehold.co/600x400/171717/f9a8d4?text=E-Commerce+Store",
      tags: ["Shopify", "React", "Tailwind CSS"],
    },
  ];

  const pricingPlans = [
    {
      title: "Starter",
      price: "$499",
      features: [
        "1-3 Page Landing Site",
        "Responsive Mobile Design",
        "Contact Form Integration",
        "Basic SEO Setup",
        "1 Week Delivery",
      ],
      popular: false,
    },
    {
      title: "Growth",
      price: "$999",
      features: [
        "Up to 5 Pages",
        "Custom UI/UX Design",
        "CMS Integration (e.g., Contentful)",
        "Blog Setup",
        "Analytics Integration",
        "Priority Support",
      ],
      popular: true,
    },
    {
      title: "Pro",
      price: "$1999+",
      features: [
        "Full-stack Web Application",
        "Database & Authentication",
        "API Integration",
        "Admin Dashboard",
        "Advanced Analytics",
        "Dedicated Support",
      ],
      popular: false,
    },
  ];

  return (
    <>
      {/* Google Font Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        .font-pacifico {
          font-family: 'Pacifico', cursive;
        }
      `}</style>
      <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-x-hidden">
        {/* Background Star Canvas */}
        <canvas ref={canvasRef} className="fixed inset-0 z-0"></canvas>

        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-800/50 py-5">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start leading-tight"
            >
              <h1 className="font-pacifico text-2xl font-bold text-white">Yaseen's</h1>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white -mt-1">
                Mock<span className="text-violet-400">Studio</span>
              </h1>
            </motion.div>

            <nav className="hidden md:flex gap-8 text-sm text-gray-300">
              {["Services", "Portfolio", "Pricing", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-violet-400 transition duration-300"
                >
                  {item}
                </a>
              ))}
            </nav>

            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-300 shadow-lg shadow-violet-800/30 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </header>

        {/* ===== HERO ===== */}
        <section id="hero" className="relative text-center py-32 md:py-48 px-6 z-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              Web Experiences
            </span>{" "}
            That Inspire 🚀
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-gray-300 mt-6 text-lg md:text-xl max-w-2xl mx-auto"
          >
            We craft high-performing websites, SaaS, and digital experiences that
            convert and captivate.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-violet-800/30 w-full sm:w-auto">
              Get a Quote <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-gray-800/50 border border-gray-700 text-gray-200 hover:bg-gray-800/80 backdrop-blur-sm px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 w-full sm:w-auto hover:border-gray-500">
              View Work
            </button>
          </motion.div>
        </section>

        {/* ===== SERVICES ===== */}
        <section id="services" className="relative max-w-7xl mx-auto px-6 py-24 z-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Our <span className="text-violet-400">Services</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                whileHover={cardHover}
                viewport={{ once: true, amount: 0.5 }}
                custom={i}
                className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 hover:border-violet-500/50 transition-colors duration-300 rounded-xl p-8 text-center shadow-lg"
              >
                <div className="w-16 h-16 bg-gray-800 text-violet-400 rounded-lg flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-violet-900/50">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== PORTFOLIO ===== */}
        <section id="portfolio" className="max-w-7xl mx-auto px-6 py-24 z-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Our <span className="text-violet-400">Work</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                whileHover={cardHover}
                viewport={{ once: true, amount: 0.5 }}
                custom={i * 2}
                className="bg-gray-950/60 backdrop-blur-sm border border-gray-800 hover:border-violet-500/50 transition-colors duration-300 rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={project.img}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64 md:h-80"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 font-medium group"
                  >
                    View Project
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 z-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Pricing <span className="text-violet-400">Plans</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                custom={i}
                className={`relative bg-gray-950/60 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 shadow-lg ${plan.popular
                    ? "border-2 border-violet-500 scale-105 shadow-2xl shadow-violet-900/30"
                    : "border border-gray-800"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-violet-400 mb-2">{plan.title}</h3>
                <p className="text-4xl font-extrabold text-white mb-4">{plan.price}</p>
                <ul className="text-gray-400 space-y-3 mb-8 text-left text-sm h-48 md:h-40">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`py-2 px-6 rounded-lg text-white font-medium w-full transition-all duration-300 transform hover:scale-105 ${plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-800/30"
                      : "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                    }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="max-w-3xl mx-auto px-6 py-24 text-center z-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl font-bold mb-6"
          >
            Let’s Build <span className="text-violet-400">Together</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={1}
            className="text-gray-400 mb-10 text-lg"
          >
            Got a project in mind? We’d love to hear from you.
          </motion.p>

          <motion.form
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={2}
            className="flex flex-col gap-4 text-left"
          >
            <input
              placeholder="Your Name"
              type="text"
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-600 focus:border-violet-600 outline-none transition duration-300"
            />
            <input
              placeholder="Your Email"
              type="email"
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-600 focus:border-violet-600 outline-none transition duration-300"
            />
            <textarea
              placeholder="Tell us about your project..."
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-600 focus:border-violet-600 outline-none transition duration-300"
              rows={5}
            ></textarea>
            <button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 py-3 text-lg rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-violet-800/30">
              Send Message
            </button>
          </motion.form>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-gray-800/50 text-center py-10 text-gray-500 text-sm z-10 relative">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <p>© 2025 Yaseen’s MockStudio — All Rights Reserved.</p>
        </footer>
      </main>
    </>
  );
}

