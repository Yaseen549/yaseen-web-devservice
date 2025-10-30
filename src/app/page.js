"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Github, Linkedin, MessageSquare } from "lucide-react";

// Import reusable components
import Header from "./partials/Header"; // Adjust path if needed
import StarsBackground from "@/components/StarsBackground";
import ContactForm from "@/components/ContactForm";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection"; // --- IMPORT NEW SECTION ---
import PortfolioSection from "@/components/sections/PortfolioSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialSection";
import ClientLogosSection from "@/components/sections/ClientLogosSection";
import Footer from "./partials/Footer";


// Section Wrapper (Only needed for Contact section now)
const Section = ({ id, title, highlight, children }) => (
  <section id={id} className="max-w-7xl mx-auto px-6 py-24 z-10">
    <h2 className="text-4xl font-bold text-center mb-16">
      {title} <span className="text-violet-400">{highlight}</span>
    </h2>
    {children}
  </section>
);

// ====== Main Component ======
export default function Home() {
  return (
    // Main container is now a flex column that takes the full screen height
    <main className="h-screen w-full bg-black text-gray-100 font-sans flex flex-col overflow-hidden">
      <StarsBackground />

      {/* Header is outside the scrollable area */}
      <Header />

      {/* ===== NEW: Scrollable content area ===== */}
      {/* flex-1 makes it take up all available space */}
      {/* overflow-y-auto enables scrolling *only* on this container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {/* ===== Hero ===== */}
        {/* All page sections are now *inside* this wrapper */}
        <section
          id="hero"
          // Changed min-h-screen to min-h-[90vh] so it doesn't break the new layout
          className="relative flex flex-col justify-center items-center min-h-[90vh] text-center px-6 z-10"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              Web Experiences
            </span>{" "}
            That Inspire 🚀
          </h2>
          <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
            We craft high-performing websites, SaaS, and digital experiences that convert and captivate.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#contact"
              className="inline-flex bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8 py-3 rounded-lg text-lg font-semibold items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-violet-800/30 cursor-pointer"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#portfolio"
              className="bg-gray-800/50 border border-gray-700 hover:bg-gray-800/80 px-8 py-3 rounded-lg text-lg font-medium transition-all hover:border-gray-500 cursor-pointer"
            >
              View Work
            </a>
          </div>
          <div className="absolute bottom-10">
            <ChevronDown className="w-8 h-8 text-gray-500 animate-bounce" />
          </div>
        </section>

        {/* ===== Render Section Components ===== */}
        <ServicesSection />
        <WhyUsSection /> {/* --- ADDED NEW SECTION HERE --- */}
        <PortfolioSection />
        <PricingSection />
        <TestimonialsSection />
        <ClientLogosSection />


        {/* ===== Contact ===== */}
        <Section id="contact" title="Let's Build" highlight="Together">
          <p className="text-gray-400 mb-10 text-center text-lg">
            Got a project in mind? We’d love to hear from you.
          </p>
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </Section>

        <Footer />
      </div>
      {/* ===== End of scrollable content area ===== */}




      {/* Floating Feedback Button (position: fixed, so it's fine) */}
      <Link
        href="/client-say"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 rounded-full text-white shadow-lg shadow-violet-800/30 transform hover:scale-110 transition-all cursor-pointer"
        title="Give Feedback / Testimonial"
      >
        <MessageSquare className="w-6 h-6" />
      </Link>

      {/* ===== NEW: CSS for the custom scrollbar ===== */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          /* Track color matches the background */
          background-color: #000000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          /* Thumb color */
          background-color: #6d28d9; /* A strong violet */
          border-radius: 10px;
          /* Border to match the track */
          border: 2px solid #000000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          /* Hover color */
          background-color: #8b5cf6; /* A lighter violet */
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6d28d9 #000000;
        }
      `}</style>
    </main>
  );
}
