// app/join/page.js
"use client";

import React from "react";
// import Header from "@/components/Header";
// import StarsBackground from "@/components/StarsBackground";
import { ArrowRight } from "lucide-react";
import StarsBackground from "@/components/StarsBackground";
import Header from "@/app/partials/Header";

export default function JoinPage() {
  return (
    <main className="min-h-screen w-full bg-black text-gray-100 font-sans overflow-hidden">
      <StarsBackground />
      <Header />

      {/* ===== Page Content ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 pt-40 text-center">
        {/* Added pt-40 for header spacing */}
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
            Join Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              Journey
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            We're always looking for talented and passionate individuals to join our growing team. If you're excited about building the future of the web and thrive in a creative, collaborative environment, we'd love to hear from you.
          </p>
          {/* You can list open positions here or link to a careers portal */}
          <div className="flex justify-center">
             <a
                // Replace '#' with your actual careers link or email
                href="mailto:contact@snippkit.com"
                className="inline-flex bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8 py-3 rounded-lg text-lg font-semibold items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-violet-800/30 cursor-pointer"
            >
                See Open Positions <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}