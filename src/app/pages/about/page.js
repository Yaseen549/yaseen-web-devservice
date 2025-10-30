// app/about/page.js
"use client";

import React from "react";
// import Header from "@/components/Header";
// import StarsBackground from "@/components/StarsBackground";
import SiteLogo from "@/components/siteLogo/SiteLogo"; // Assuming this path
import Header from "@/app/partials/Header";
import StarsBackground from "@/components/StarsBackground";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
      <StarsBackground />
      <Header />

      {/* ===== Page Content ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-40 text-center">
        {/* Added pt-40 for header spacing */}
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
            About{" "}
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
          {/* You can add more sections like "Our Values", "Our Team", etc. */}
        </div>
      </section>
    </main>
  );
}