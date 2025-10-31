"use client";

import React from "react";
import SiteLogo from "@/components/siteLogo/SiteLogo";
import Header from "@/app/partials/Header";
import StarsBackground from "@/components/StarsBackground";
import { motion } from "framer-motion";
import { Sparkles, Users, Rocket, Globe } from "lucide-react";
import { Pacifico } from "next/font/google";
// Load Pacifico font for this component only
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

// --- Section Wrapper ---
const Section = ({ title, highlight, subtitle, children }) => (
  <section className="relative z-10 flex flex-col items-center text-center py-24 px-6">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
      {title}{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
        {highlight}
      </span>
    </h2>
    {subtitle && <p className="text-gray-300 max-w-2xl mb-12">{subtitle}</p>}
    {children}
  </section>
);

// --- Info Card for Mission/Values/Team ---
const InfoCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-gray-950/60 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-violet-500/50 transition-all duration-300 max-w-xs`}
  >
    <Icon className={`w-12 h-12 mb-4 ${color || "text-violet-400"}`} />
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-auto relative custom-scrollbar">
      {/* Background Stars */}
      <StarsBackground />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
            About <span className={`${pacifico.className} text-5xl text-white leading-none`}>Yaseen's</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              MockStudio
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            We are passionate creators dedicated to building exceptional web experiences. Our mission is to blend minimalist design with maximum performance, crafting digital solutions that not only look stunning but also drive results.
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Founded by Yaseen, MockStudio leverages modern technologies like Next.js, Supabase, and Vercel to deliver high-performing websites and SaaS applications tailored to your unique needs.
          </p>
        </div>
      </section>

      {/* Space Adventure Cards */}
      <Section
        title="Our"
        highlight="Mission & Vision"
        subtitle="We are on a journey to craft digital experiences that feel out of this world."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
          <InfoCard
            icon={Rocket}
            color="text-pink-400"
            title="Our Mission"
            description="Deliver high-quality web solutions with a focus on speed, performance, and stunning design."
          />
          <InfoCard
            icon={Globe}
            color="text-blue-400"
            title="Our Vision"
            description="Empower developers and businesses worldwide with digital tools that inspire creativity."
          />
          <InfoCard
            icon={Users}
            color="text-violet-400"
            title="Our Team"
            description="A tight-knit crew of developers, designers, and innovators, passionate about code and creativity."
          />
        </div>
      </Section>

      {/* CTA Section */}
      <section className="relative z-10 flex flex-col items-center justify-center py-24 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Join Us on Our Space Adventure
        </h2>
        <p className="text-gray-300 max-w-xl text-center mb-8">
          Whether you're a client, collaborator, or fellow explorer, MockStudio welcomes you aboard our journey to create the next-gen digital universe.
        </p>
        <a
          href="/pages/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-semibold text-lg hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-800/50 transition-all duration-300"
        >
          Get in Touch
        </a>
      </section>
    </main>
  );
}
