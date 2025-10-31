"use client";

import React from "react";
import {
  ArrowRight,
  ChevronDown,
  MessageSquare,
  Star,
  Sparkles, // Added for new pre-headline
  Mouse, // Added for new scroll indicator
} from "lucide-react";

// Import reusable components
// Assuming these paths are correct relative to this new file
import Header from "./partials/Header";
import StarsBackground from "@/components/StarsBackground";
import ContactForm from "@/components/ContactForm";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialSection";
import ClientLogosSection from "@/components/sections/ClientLogosSection";
import Footer from "./partials/Footer";
import FloatingButtons from "@/components/floatingButton/FloatingButtons";
import HeroSection from "@/components/sections/HeroSection";

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
    <main className="h-screen w-full bg-black text-gray-100 font-sans flex flex-col overflow-y-hidden">
      <StarsBackground />

      <Header />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* ===== New Hero Section ===== */}
        <HeroSection />

        {/* ===== Render Section Components ===== */}
        <ServicesSection />
        <WhyUsSection />
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

        {/* Floating Buttons (Compact Style) */}
        <FloatingButtons />


        <Footer />
      </div>
    </main>
  );
}
